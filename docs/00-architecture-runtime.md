**Title**: Runtime Architecture & Execution Flow  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Runtime, Backend, Execution

---

# Runtime Architecture & Execution Flow: FutureSelfApp

## Document Purpose

This document defines the **official runtime architecture** of the FutureSelfApp platform. It establishes zero ambiguity about:

- How HTTP requests flow through the system
- How AI tasks are executed
- Where responsibility lies for each layer
- How errors propagate
- How environment variables are managed
- Platform-specific constraints and requirements

**Authority Statement**: This document has **higher authority** than feature documentation, service specifications, or UX design documents. Any code change that alters runtime behavior must update this document. In case of conflict between this document and other documentation, this document takes precedence.

**Why This Document Exists**: Runtime architecture must be explicit because:
- The hybrid Flask → Node.js → AI Providers architecture is non-standard
- Environment variable propagation across Python and Node.js boundaries is critical
- Subprocess communication protocols must be strictly defined
- Error handling and response formats must be deterministic
- Platform compatibility (especially Windows) requires explicit constraints

---

## High-Level Architecture Overview

### Architecture Diagram

```
┌─────────────────┐
│  Frontend (UI)  │  React components, Flask templates, static assets
└────────┬────────┘
         │ HTTP Request
         ▼
┌─────────────────┐
│ Flask Backend   │  Python 3, Flask framework, request handling
│   (app.py)      │  Template rendering, file uploads, routing
└────────┬────────┘
         │ subprocess.run() with JSON stdin
         │ env=os.environ.copy()
         ▼
┌─────────────────┐
│ Node.js Bridge  │  Node.js runtime, AI orchestration
│    (/src)       │  Provider abstraction, tool execution
└────────┬────────┘
         │ HTTP API calls
         ▼
┌─────────────────┐
│  AI Providers   │  OpenAI, Anthropic, Gemini, Replicate
│  (External)     │  Third-party AI services
└─────────────────┘
```

### Layer Responsibilities

#### 1. Frontend UI Layer
**Location**: `/pages` (React components), `/templates` (Flask templates)

**Responsibilities**:
- User interface rendering
- User input collection
- HTTP request initiation to Flask backend
- Response display and error presentation
- Client-side validation (optional, not authoritative)

**Does NOT**:
- Execute AI tasks directly
- Access AI providers directly
- Manage environment variables
- Handle file processing beyond upload

#### 2. Flask Backend (Python)
**Location**: `app.py`

**Responsibilities**:
- HTTP request routing and handling
- Request validation (file uploads, form data, JSON)
- Template rendering for static pages
- File upload handling and temporary storage
- **Subprocess orchestration**: Spawning Node.js processes
- **Environment variable loading**: Loading `.env` at startup
- **Environment variable propagation**: Passing `os.environ.copy()` to subprocess
- Response formatting and HTTP status codes
- Error handling and user-facing error messages

**Critical Functions**:
- Loads `.env` file at startup using `python-dotenv`
- Spawns Node.js subprocess with `subprocess.run()`
- Passes environment variables via `env=os.environ.copy()`
- Sends JSON input via stdin
- Receives JSON output via stdout
- Parses stdout as JSON (preferred over returncode)
- Handles timeouts (60 seconds default)

**Does NOT**:
- Execute AI tasks directly (delegates to Node.js)
- Access AI provider APIs directly
- Manage Node.js module dependencies

#### 3. Node.js Bridge
**Location**: `/src` directory

**Responsibilities**:
- **Environment variable loading**: Loads `.env` again (idempotent, override: true)
- **AI orchestration**: Routes tasks to appropriate providers
- **Provider abstraction**: Manages multiple AI providers (OpenAI, Anthropic, Gemini)
- **AI Service execution**: Executes AI Services via tool registry
- **Error handling**: Converts errors to structured JSON
- **JSON-only stdout**: All output to stdout must be valid JSON
- **Logging to stderr**: All logs, errors, debug info to stderr only

**Critical Functions**:
- Reads JSON from `process.stdin`
- Validates input (provider, task, payload)
- Executes AI task via `ai.router.runAiTask()`
- Outputs JSON to `process.stdout` (success or error)
- Sets `process.exitCode` (never calls `process.exit()`)
- Logs to `process.stderr` only

**Does NOT**:
- Handle HTTP requests directly
- Manage Flask routes
- Access file system beyond environment loading

#### 4. AI Providers (External)
**Location**: Third-party services (OpenAI API, Anthropic API, etc.)

**Responsibilities**:
- Execute AI tasks (text generation, image generation, etc.)
- Return results via HTTP API responses
- Handle provider-specific authentication
- Manage provider-specific rate limits and quotas

**Does NOT**:
- Know about Flask or Node.js architecture
- Handle user authentication
- Manage application state

---

## Detailed Execution Flow

### Step-by-Step: AI Request Flow

#### Step 1: User Action in UI
**Location**: Frontend (React component or Flask template)

**Process**:
1. User interacts with UI (clicks button, submits form, etc.)
2. Frontend collects input data (text, file uploads, selections)
3. Frontend constructs HTTP request to Flask endpoint
4. Request sent via `fetch()` or form submission

**Example**: User uploads image and enters dream text, clicks "Generate"

#### Step 2: Flask Request Reception
**Location**: `app.py` route handler (e.g., `/dev/run`)

**Process**:
1. Flask receives HTTP request
2. Flask validates request (method, content-type, required fields)
3. Flask extracts request data (`request.get_json()` or `request.files`)
4. Flask performs initial validation (file size, format, required fields)

**Error Handling**: If validation fails, Flask returns JSON error response immediately (no Node.js call)

#### Step 3: Flask Subprocess Preparation
**Location**: `app.py` subprocess execution

**Process**:
1. Flask constructs input JSON:
   ```python
   input_json = json.dumps({
       "provider": provider,
       "task": task,
       "payload": payload
   })
   ```
2. Flask determines Node.js script path:
   ```python
   script_path = os.path.join(
       os.path.dirname(__file__),
       "src",
       "dev",
       "run-ai-task.js"
   )
   ```
3. Flask prepares environment: `env=os.environ.copy()`
   - **CRITICAL**: `os.environ.copy()` is mandatory, not optional
   - This ensures Node.js receives all Flask environment variables
   - Includes `.env` variables loaded by Flask at startup

#### Step 4: Flask Spawns Node Subprocess
**Location**: `app.py` subprocess execution

**Process**:
```python
result = subprocess.run(
    ["node", script_path],
    input=input_json,
    capture_output=True,
    text=True,
    timeout=60,  # 60 second timeout
    env=os.environ.copy()  # MANDATORY
)
```

**Critical Parameters**:
- `input=input_json`: JSON string sent via stdin
- `capture_output=True`: Captures both stdout and stderr
- `text=True`: Treats output as text (not bytes)
- `timeout=60`: 60-second execution limit
- `env=os.environ.copy()`: **MANDATORY** - passes all environment variables

**Error Handling**: `subprocess.TimeoutExpired` exception if execution exceeds 60 seconds

#### Step 5: Node.js Environment Loading
**Location**: `src/dev/run-ai-task.js` → `src/core/env/env.loader.js`

**Process**:
1. Node.js script starts execution
2. Node.js calls `ensureEnvLoaded({ override: true })`
3. Environment loader:
   - Finds project root (walks up from `src/core/env/` to find `package.json` or `.env`)
   - Loads `.env` file using `dotenv.config({ override: true })`
   - Overrides any existing environment variables
4. Environment variables now available in `process.env`

**Why Load Twice?**:
- Flask loads `.env` for Flask-specific needs
- Node.js loads `.env` again to ensure Node.js has access (defensive)
- `override: true` ensures Node.js values take precedence if conflicts exist
- This is idempotent and safe

#### Step 6: Node.js Input Parsing
**Location**: `src/dev/run-ai-task.js`

**Process**:
1. Node.js reads from `process.stdin`:
   ```javascript
   inputData = await new Promise((resolve, reject) => {
       let data = '';
       process.stdin.on('data', (chunk) => { data += chunk; });
       process.stdin.on('end', () => { resolve(data); });
       process.stdin.on('error', (err) => { reject(err); });
   });
   ```
2. Node.js parses JSON:
   ```javascript
   input = JSON.parse(inputData);
   const { provider, task, payload } = input;
   ```
3. Node.js validates required fields (provider, task, payload)

**Error Handling**: If JSON parsing fails, Node.js outputs error JSON to stdout and sets `process.exitCode = 1`

#### Step 7: AI Provider Execution
**Location**: `src/ai/orchestration/ai.router.js` → Provider clients

**Process**:
1. Node.js calls `runAiTask({ provider, task, payload, identity })`
2. AI router validates inputs (provider exists, task is valid, payload is object)
3. AI router applies rate limiting (if configured)
4. AI router gets provider client from registry
5. AI router routes to appropriate task handler:
   - `TEXT_GENERATION` → `providerClient.generateText(payload)`
   - `IMAGE_GENERATION` → `providerClient.generateImage(payload)`
   - `IMAGE_EDIT` → `providerClient.editImage(payload)`
   - `IMAGE_ANALYSIS` → `providerClient.analyzeImage(payload)`
   - `AUDIO_TRANSCRIPTION` → `providerClient.transcribeAudio(payload)`
6. Provider client makes HTTP request to external AI API
7. Provider client receives response and normalizes format
8. AI router returns normalized result

**Error Handling**: Errors are caught, converted to `AppError`, and propagated up

#### Step 8: Node.js JSON Response Output
**Location**: `src/dev/run-ai-task.js`

**Process**:
1. If successful:
   ```javascript
   writeJson({
       success: true,
       result: result
   });
   process.exitCode = 0;
   ```
2. If error:
   ```javascript
   writeError(
       err.code || 'UNKNOWN_ERROR',
       err.message || 'Unknown error',
       err.details || null,
       err.statusCode || 500
   );
   process.exitCode = 1;
   ```

**CRITICAL RULES**:
- **JSON-only stdout**: All output to `process.stdout` must be valid JSON
- **No process.exit()**: Never call `process.exit()`, only set `process.exitCode`
- **Stderr for logs**: All logging, debug info, stack traces go to `process.stderr`
- **Deterministic output**: Same input must produce same JSON structure

#### Step 9: Flask JSON Response Parsing
**Location**: `app.py` subprocess result handling

**Process**:
1. Flask receives `subprocess.CompletedProcess` result
2. Flask attempts to parse `result.stdout` as JSON:
   ```python
   try:
       output = json.loads(result.stdout)
   except json.JSONDecodeError:
       # Handle parse error
   ```
3. Flask checks for success/error:
   - If `output.get("success") == True`: Return success response
   - If `output.get("success") == False`: Extract error and return error response
4. Flask maps error codes to HTTP status codes:
   - `OPENAI_KEY_MISSING`, `OPENAI_ERROR` → 400
   - `TIMEOUT` → 504
   - `NODE_PROCESS_FAILED` → 500
   - Default error → 500

**CRITICAL**: Flask prefers JSON parsing over `result.returncode`:
- Even if `returncode != 0`, Flask attempts JSON parse first
- Only if JSON parsing fails AND `returncode != 0` is it treated as a crash
- This allows Node.js to return structured errors via JSON

#### Step 10: Response Returned to Frontend
**Location**: Flask → Frontend

**Process**:
1. Flask returns JSON response with appropriate HTTP status code
2. Frontend receives response
3. Frontend handles success or error:
   - Success: Display results, update UI
   - Error: Display error message, allow retry

---

## Environment & Configuration Rules

### Where `.env` Lives

**Location**: Project root directory (same directory as `app.py` and `package.json`)

**Path Resolution**:
- Flask: `os.path.join(os.path.dirname(__file__), '.env')` (project root)
- Node.js: Walks up from `src/core/env/` to find `package.json` or `.env` file

**File Format**: Standard `.env` format (KEY=VALUE, one per line, no quotes around values)

### Who Loads `.env`

#### Flask (Python) Loading
**When**: At Flask application startup (before any routes are registered)

**How**:
```python
from dotenv import load_dotenv
project_root = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=env_path, override=True)
```

**Result**: Environment variables available in `os.environ`

#### Node.js Loading
**When**: Every time Node.js script is executed (each subprocess invocation)

**How**:
```javascript
const { ensureEnvLoaded } = require('../core/env/env.loader');
ensureEnvLoaded({ override: true });
```

**Result**: Environment variables available in `process.env`

### How Environment Variables Propagate

#### Flask → Node.js Propagation
**Method**: `env=os.environ.copy()` in `subprocess.run()`

**Why This Is Mandatory**:
- Node.js subprocess is a separate process with its own environment
- Without `env=os.environ.copy()`, Node.js would only inherit system environment variables
- Flask's loaded `.env` variables would not be available to Node.js
- `os.environ.copy()` creates a copy (does not modify original)

**What Gets Propagated**:
- All environment variables from `os.environ` (including `.env` variables)
- System environment variables
- Flask-set environment variables

**Override Behavior**:
- Node.js loads `.env` again with `override: true`
- If `.env` values differ from propagated values, Node.js values take precedence
- This is intentional: Node.js has final say on environment variable values

### Why `env=os.environ.copy()` Is Mandatory

**Technical Reason**:
- Python's `subprocess.run()` without `env` parameter inherits parent process environment
- However, on some platforms (especially Windows), environment variable inheritance can be unreliable
- Explicit `env=os.environ.copy()` ensures deterministic behavior across all platforms

**Platform Compatibility**:
- **Windows**: Environment variable inheritance can be inconsistent; explicit copy is required
- **Linux/macOS**: Inheritance works, but explicit copy ensures consistency

**Error Prevention**:
- Without explicit copy, Node.js might not receive required API keys
- This would cause silent failures or unclear error messages
- Explicit copy makes environment variable propagation visible and debuggable

---

## Error Handling Contract

### JSON-Only Stdout Requirement

**Rule**: Node.js must output **only valid JSON** to `process.stdout`. No other output is permitted.

**Why**:
- Flask parses `result.stdout` as JSON
- Any non-JSON output breaks parsing
- Mixed output (JSON + text) is impossible to parse reliably

**Implementation**:
```javascript
function writeJson(obj) {
  process.stdout.write(JSON.stringify(obj));
}

// Success
writeJson({ success: true, result: data });

// Error
writeJson({ 
    success: false, 
    error: { 
        code: "ERROR_CODE",
        message: "Error message",
        statusCode: 500
    }
});
```

**Forbidden**:
- `console.log()` to stdout (use `console.error()` or `process.stderr.write()`)
- Debug output to stdout
- Progress indicators to stdout
- Any text output to stdout

### Error vs Success Structure

#### Success Response Format
```json
{
    "success": true,
    "result": {
        "provider": "openai",
        "task": "text_generation",
        "data": "Generated text content"
    }
}
```

#### Error Response Format
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Human-readable error message",
        "details": null,
        "statusCode": 500
    }
}
```

**Error Code Standards**:
- `OPENAI_KEY_MISSING`: OpenAI API key not found
- `OPENAI_ERROR`: OpenAI API returned an error
- `INVALID_INPUT`: Request validation failed
- `INVALID_JSON_INPUT`: JSON parsing failed
- `NODE_PROCESS_FAILED`: Node.js process crashed
- `TIMEOUT`: Execution exceeded timeout
- `AI_TASK_FAILED`: AI task execution failed
- `UNKNOWN_ERROR`: Unhandled error

### Why `process.exit()` Is Forbidden

**Rule**: Node.js scripts must **never** call `process.exit()`. Only set `process.exitCode`.

**Why**:
- `process.exit()` terminates the process immediately, potentially before stdout is flushed
- This can cause Flask to receive incomplete JSON or no output
- `process.exitCode` allows the process to terminate naturally after all output is written
- Natural termination ensures stdout buffer is flushed

**Implementation**:
```javascript
// CORRECT
process.exitCode = 0;  // or 1 for error
await new Promise(r => setImmediate(r));  // Allow stdout to flush
return;

// FORBIDDEN
process.exit(0);  // Never do this
```

### How Flask Interprets Node Responses

#### Success Path
1. Flask parses `result.stdout` as JSON
2. Flask checks `output.get("success") == True`
3. Flask extracts `output.get("result")`
4. Flask returns JSON response with HTTP 200

#### Error Path
1. Flask parses `result.stdout` as JSON
2. Flask checks `output.get("success") == False`
3. Flask extracts `output.get("error")`
4. Flask maps error code to HTTP status:
   - `OPENAI_KEY_MISSING`, `OPENAI_ERROR` → 400
   - `TIMEOUT` → 504
   - Default → 500
5. Flask returns JSON error response

#### Crash Path (JSON Parse Failure)
1. Flask attempts to parse `result.stdout` as JSON
2. JSON parsing fails
3. Flask checks `result.returncode`:
   - If `returncode != 0`: Treat as crash, return 500 error
   - If `returncode == 0`: Treat as invalid output, return 500 error
4. Flask includes stderr snippet in error response for debugging

---

## Stability & Platform Constraints

### Windows Compatibility Constraints

**Critical Constraints**:
1. **Environment Variable Inheritance**: Windows subprocess environment inheritance can be unreliable. Always use `env=os.environ.copy()`.
2. **Path Separators**: Use `os.path.join()` in Python, `path.join()` in Node.js (never hardcode `/` or `\`).
3. **Process Termination**: Windows may require explicit process termination handling. Use `process.exitCode` instead of `process.exit()`.
4. **File Paths**: Long file paths may cause issues. Keep paths relative to project root when possible.

**Tested Platforms**:
- Windows 10/11 (primary development platform)
- Linux (deployment target)
- macOS (development platform)

### Node Subprocess Lifecycle Rules

**Lifecycle Stages**:
1. **Spawn**: Flask creates subprocess with `subprocess.run()`
2. **Execution**: Node.js script runs, loads environment, executes task
3. **Output**: Node.js writes JSON to stdout, logs to stderr
4. **Termination**: Node.js sets `process.exitCode` and terminates naturally
5. **Collection**: Flask collects stdout and stderr via `capture_output=True`

**Lifecycle Constraints**:
- **Single Execution**: Each subprocess handles one request (no persistent Node.js processes)
- **No State Persistence**: Each subprocess starts fresh (no shared state between requests)
- **Timeout Protection**: 60-second timeout prevents hung processes
- **Resource Cleanup**: Subprocess resources are automatically cleaned up after execution

### Timeouts and Execution Limits

**Flask Subprocess Timeout**: 60 seconds

**Why 60 Seconds**:
- AI provider API calls can take 30-60 seconds for complex tasks
- 60 seconds provides reasonable buffer without blocking too long
- Prevents hung processes from consuming resources indefinitely

**Timeout Handling**:
```python
try:
    result = subprocess.run(..., timeout=60)
except subprocess.TimeoutExpired:
    return jsonify({
        "success": False,
        "error": {
            "message": "AI task timed out",
            "code": "TIMEOUT",
            "statusCode": 504
        }
    }), 504
```

**Provider-Specific Timeouts**:
- Individual provider clients may have their own timeout settings
- Provider timeouts should be less than 60 seconds to allow for subprocess overhead
- Recommended: 45-50 seconds for provider timeouts

### Deterministic Behavior Principles

**Principle 1: Same Input, Same Output**
- Given identical input (provider, task, payload), the system should produce identical JSON structure
- Error messages may vary, but error structure must be consistent
- Success responses must follow the same format

**Principle 2: No Hidden State**
- Each subprocess execution is independent
- No shared state between requests
- Environment variables are the only external input (besides request data)

**Principle 3: Fail Fast, Fail Clearly**
- Validation errors return immediately (no AI provider calls)
- Error messages are specific and actionable
- Error codes are consistent and documented

**Principle 4: Platform Independence**
- Architecture works identically on Windows, Linux, macOS
- No platform-specific code paths in core execution flow
- Environment variable handling is platform-agnostic

---

## Authority Statement

### Document Authority

This document defines the **official runtime architecture** of the FutureSelfApp platform. It has **higher authority** than:

- Feature documentation (`docs/09-tools-system-architecture.md`)
- Service specifications (`SERVICES.md`)
- UX design documents (`docs/08-dashboard-ux-flow.md`)
- Planning documents (`PLAN.md`)

**Rule**: When documentation conflicts occur, this document takes precedence for runtime behavior decisions.

### Code Change Requirements

**Mandatory Updates**: Any code change that alters runtime behavior must update this document, including:

- Changes to subprocess execution (`subprocess.run()` parameters)
- Changes to environment variable loading or propagation
- Changes to JSON response formats (stdout structure)
- Changes to error handling or error codes
- Changes to timeout values or execution limits
- Changes to platform compatibility constraints

**Update Process**:
1. Identify which section of this document is affected
2. Update the relevant section with new behavior
3. Maintain backward compatibility notes if behavior changes
4. Update version and last modified date

### Conflict Resolution

**If This Document Conflicts With Other Documentation**:
1. This document (`docs/00-architecture-runtime.md`) is authoritative
2. Other documentation should be updated to match this document
3. If conflict is intentional (e.g., planned refactor), both documents should note the discrepancy

**If Code Conflicts With This Document**:
1. Code is the source of truth for actual behavior
2. This document should be updated to match code
3. If code behavior is incorrect, code should be fixed to match this document

---

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [API Contracts](00-api-contracts.md)
- [Cursor Playbook](00-cursor-playbook.md)
