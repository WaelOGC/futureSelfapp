**Title**: API Contracts & JSON Schemas  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: API, Backend, Frontend

---

# API Contracts & JSON Schemas: FutureSelfApp

## Document Purpose

This document defines the **official API contracts** for the FutureSelfApp platform. It establishes zero ambiguity about:

- Request/response structures between UI, Flask backend, and Node.js bridge
- Error handling formats and error codes
- Validation rules and required fields
- JSON schema specifications for all API interactions

**Authority Statement**: UI, backend, and AI services **must conform** to these contracts. Any endpoint change must update this document. Any service must comply with these schemas. Cursor must not invent payloads outside this contract.

**Why This Document Exists**: API contracts are mandatory because:
- Frontend and backend teams must work independently with clear contracts
- AI service integration requires deterministic payload structures
- Error handling must be consistent across all layers
- Validation rules prevent runtime failures
- Schema compliance ensures system stability

---

## Global API Principles

### Base API Path Conventions

**Flask Backend Routes**:
- Development endpoints: `/dev/*` (disabled in production via `NODE_ENV=production`)
- Production endpoints: `/generate`, `/about`, `/how-it-works`, etc.
- All API endpoints return JSON (except template rendering routes)

**Node.js Bridge**:
- Not directly accessible via HTTP
- Invoked via subprocess from Flask
- Communication via stdin/stdout (JSON only)

### HTTP Methods Usage

**POST**: Used for all state-changing operations
- `/dev/run` - Execute AI task
- `/generate` - Generate Time Capsule content

**GET**: Used for read-only operations
- `/dev/env` - Environment diagnostic (development only)
- Template routes - Page rendering

**No PUT, PATCH, DELETE**: Not currently used in the platform

### Authentication Assumptions

**Current State**: No authentication implemented
- All endpoints are publicly accessible
- No API keys required for Flask endpoints
- AI provider API keys are managed server-side via environment variables

**Future Considerations**: Authentication will be added without breaking these contracts

### Content Type Requirements

**Request Content-Type**:
- JSON requests: `Content-Type: application/json`
- Form data requests: `Content-Type: multipart/form-data` (for file uploads)

**Response Content-Type**:
- All API responses: `Content-Type: application/json`
- Template routes: `Content-Type: text/html`

**Validation**: Flask validates content type; invalid content type returns 400 error

---

## Standard Request Envelope

### UI → Flask Request Structure

#### JSON Request (Standard)

**Schema**:
```json
{
  "provider": "string (required)",
  "task": "string (required)",
  "payload": "object (required)"
}
```

**Field Specifications**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `provider` | string | Yes | AI provider identifier | Must be one of: `OPENAI`, `GEMINI`, `ANTHROPIC` |
| `task` | string | Yes | AI task type | Must be one of: `TEXT_GENERATION`, `IMAGE_GENERATION`, `IMAGE_EDIT`, `IMAGE_ANALYSIS`, `AUDIO_TRANSCRIPTION` |
| `payload` | object | Yes | Task-specific payload | Must be non-null object |

**Example Request**:
```json
{
  "provider": "OPENAI",
  "task": "TEXT_GENERATION",
  "payload": {
    "prompt": "Write a short story",
    "system": "You are a creative writer",
    "model": "gpt-4o-mini"
  }
}
```

#### Form Data Request (Legacy `/generate` Endpoint)

**Schema**:
- `image`: File upload (required)
- `dream`: String (required, form field)

**Content-Type**: `multipart/form-data`

**Validation**:
- `image` must be present in `request.files`
- `dream` must be non-empty string after `.strip()`

### Request Validation Rules

**Flask Validation** (applies to `/dev/run`):
1. Request body must be valid JSON (if JSON endpoint)
2. `provider` must be present and non-empty string
3. `task` must be present and non-empty string
4. `payload` must be present and non-null object
5. If any validation fails, return 400 with error structure

**Validation Error Response**:
```json
{
  "success": false,
  "error": {
    "message": "Missing required fields: provider, task, payload",
    "code": "INVALID_INPUT",
    "statusCode": 400
  }
}
```

---

## Standard Response Envelope

### Success Response Structure

**Schema**:
```json
{
  "success": true,
  "result": {
    "provider": "string",
    "task": "string",
    "success": true,
    "data": "any"
  }
}
```

**Field Specifications**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | boolean | Yes | Always `true` for success responses |
| `result` | object | Yes | AI task execution result |
| `result.provider` | string | Yes | Provider identifier used |
| `result.task` | string | Yes | Task type executed |
| `result.success` | boolean | Yes | Always `true` |
| `result.data` | any | Yes | Task-specific result data |

**Example Success Response**:
```json
{
  "success": true,
  "result": {
    "provider": "OPENAI",
    "task": "TEXT_GENERATION",
    "success": true,
    "data": "Generated text content here..."
  }
}
```

### Error Response Structure

**Schema**:
```json
{
  "success": false,
  "error": {
    "code": "string (required)",
    "message": "string (required)",
    "details": "any (optional)",
    "statusCode": "number (required)"
  }
}
```

**Field Specifications**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | boolean | Yes | Always `false` for error responses |
| `error` | object | Yes | Error information |
| `error.code` | string | Yes | Machine-readable error code |
| `error.message` | string | Yes | Human-readable error message |
| `error.details` | any | No | Additional error context (null if not provided) |
| `error.statusCode` | number | Yes | HTTP status code (400, 500, 504, etc.) |

**Example Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "OPENAI_ERROR",
    "message": "OpenAI API error: Invalid API key",
    "details": null,
    "statusCode": 400
  }
}
```

### Consistency Guarantees

**Response Format**:
- All API responses follow the success/error envelope structure
- `success` field is always present (boolean)
- Either `result` (success) or `error` (failure) is present, never both
- HTTP status code matches `error.statusCode` for errors
- HTTP status code is 200 for success responses (unless overridden)

**Legacy Endpoint Exception**:
- `/generate` endpoint uses legacy format: `{"success": true, "aged_image_url": "...", "wisdom_letter": "..."}`
- Legacy format will be migrated to standard envelope in future

---

## Error Taxonomy

### Error Categories

#### 1. Validation Errors (400)

**Error Codes**:
- `INVALID_INPUT`: Missing or invalid required fields
- `INVALID_JSON_INPUT`: JSON parsing failed
- `INVALID_TASK`: Invalid task type specified

**HTTP Status**: 400

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Missing required fields: provider, task, payload",
    "details": null,
    "statusCode": 400
  }
}
```

#### 2. Authentication Errors (401/500)

**Error Codes**:
- `OPENAI_KEY_MISSING`: OpenAI API key not found in environment
- `PROVIDER_NOT_CONFIGURED`: Provider not properly configured

**HTTP Status**: 400 (for OpenAI errors), 500 (for configuration errors)

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "OPENAI_KEY_MISSING",
    "message": "OPENAI_API_KEY is not loaded. Ensure .env exists at project root and restart.",
    "details": null,
    "statusCode": 500
  }
}
```

#### 3. Provider Errors (400/500)

**Error Codes**:
- `OPENAI_ERROR`: OpenAI API returned an error
- `PROVIDER_NOT_IMPLEMENTED`: Provider does not support requested task
- `TASK_NOT_SUPPORTED`: Task not supported by provider
- `AI_TASK_FAILED`: AI task execution failed

**HTTP Status**: 400 (for OpenAI-specific errors), 500 (for other provider errors)

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "OPENAI_ERROR",
    "message": "OpenAI API error: Invalid API key",
    "details": {
      "originalError": "401 Unauthorized",
      "status": 401
    },
    "statusCode": 400
  }
}
```

#### 4. Execution Errors (500)

**Error Codes**:
- `NODE_PROCESS_FAILED`: Node.js subprocess crashed
- `NODE_OUTPUT_NOT_JSON`: Node.js output is not valid JSON
- `DOTENV_LOAD_FAILED`: Failed to load .env file
- `DEPENDENCIES_MISSING`: Required Node.js dependencies missing
- `UNKNOWN_ERROR`: Unhandled error occurred
- `FATAL_ERROR`: Fatal unhandled error in Node.js main

**HTTP Status**: 500

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "NODE_PROCESS_FAILED",
    "message": "Node bridge crashed or exited with error",
    "details": "Error stack trace snippet...",
    "statusCode": 500
  }
}
```

#### 5. System Errors (500/504)

**Error Codes**:
- `TIMEOUT`: Execution exceeded timeout limit
- `INTERNAL_ERROR`: Internal server error

**HTTP Status**: 504 (timeout), 500 (internal error)

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "TIMEOUT",
    "message": "AI task timed out",
    "details": null,
    "statusCode": 504
  }
}
```

### Error Code Standards

**Naming Convention**:
- UPPER_SNAKE_CASE
- Descriptive and specific
- Category prefix when applicable (e.g., `OPENAI_*`, `NODE_*`)

**Error Message Standards**:
- Human-readable
- Actionable (suggests what user can do)
- No technical jargon in user-facing messages
- Technical details in `details` field if needed

---

## AI Execution Contract

### Flask → Node.js Bridge Contract

#### Input Contract (Flask → Node.js via stdin)

**Schema**:
```json
{
  "provider": "string (required)",
  "task": "string (required)",
  "payload": "object (required)"
}
```

**Field Specifications**:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `provider` | string | Yes | Must be registered provider: `OPENAI`, `GEMINI`, `ANTHROPIC` |
| `task` | string | Yes | Must be valid task: `TEXT_GENERATION`, `IMAGE_GENERATION`, `IMAGE_EDIT`, `IMAGE_ANALYSIS`, `AUDIO_TRANSCRIPTION` |
| `payload` | object | Yes | Task-specific payload structure |

**Transmission**:
- JSON string sent via `subprocess.run(input=json_string)`
- Node.js reads from `process.stdin`
- Node.js parses JSON with `JSON.parse()`

**Validation**:
- Node.js validates JSON parsing (returns `INVALID_JSON_INPUT` if fails)
- Node.js validates required fields (returns `INVALID_INPUT` if missing)

#### Output Contract (Node.js → Flask via stdout)

**Success Schema**:
```json
{
  "success": true,
  "result": {
    "provider": "string",
    "task": "string",
    "success": true,
    "data": "any"
  }
}
```

**Error Schema**:
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "any",
    "statusCode": "number"
  }
}
```

**Transmission**:
- JSON written to `process.stdout` only
- No other output to stdout (logs go to stderr)
- Flask parses `result.stdout` as JSON

**Critical Rules**:
- **JSON-only stdout**: All output must be valid JSON
- **No process.exit()**: Only set `process.exitCode`
- **Stderr for logs**: All logging to `process.stderr`

### Node.js → AI Provider Contract (Abstracted)

#### Provider Interface Contract

**Provider Methods** (per `src/ai/contracts/ai.interface.js`):

| Task | Method | Payload Structure |
|------|--------|-------------------|
| `TEXT_GENERATION` | `generateText(payload)` | `{ prompt: string, system?: string, model?: string }` |
| `IMAGE_GENERATION` | `generateImage(payload)` | Provider-specific |
| `IMAGE_EDIT` | `editImage(payload)` | Provider-specific |
| `IMAGE_ANALYSIS` | `analyzeImage(payload)` | Provider-specific |
| `AUDIO_TRANSCRIPTION` | `transcribeAudio(payload)` | Provider-specific |

**Provider Registration**:
- Providers must be registered via `registerProvider(name, client)`
- Provider clients must implement required methods
- Missing methods throw `TASK_NOT_SUPPORTED` error

#### Task-Specific Payload Contracts

**TEXT_GENERATION Payload**:
```json
{
  "prompt": "string (required)",
  "system": "string (optional)",
  "model": "string (optional, default: 'gpt-4o-mini')"
}
```

**Response**:
- String: Generated text content
- Normalized by AI router to: `{ provider, task, success: true, data: "text" }`

**Other Tasks**:
- Currently not fully implemented
- Will follow same normalization pattern when implemented

### Timeout Behavior

**Flask Subprocess Timeout**: 60 seconds

**Behavior**:
- If Node.js execution exceeds 60 seconds, Flask raises `subprocess.TimeoutExpired`
- Flask returns timeout error: `{"success": false, "error": {"code": "TIMEOUT", ...}}`
- Node.js process is terminated by Flask

**Provider Timeouts**:
- Individual provider clients may have their own timeout settings
- Provider timeouts should be less than 60 seconds
- Recommended: 45-50 seconds for provider HTTP requests

---

## Status & Observability

### Execution Status Tracking

**Node.js Status Tracking** (via `src/dev/status.js`):
- `setEnvReady(boolean)`: Environment loading status
- `setOpenaiReady(boolean)`: OpenAI provider status
- `setLastTest(string)`: Last test execution status (`"OK"` or `"FAILED"`)

**Status Persistence**:
- In-memory only (not persisted across requests)
- Reset on each Node.js subprocess invocation
- Used for development dashboard diagnostics

### Test Results Reporting

**Development Dashboard** (`/dev`):
- Environment diagnostic: `/dev/env` (GET)
- AI task execution: `/dev/run` (POST)

**Response Format**:
- Standard success/error envelope
- Status information included in response or separate endpoint

### Dashboard Expectations

**Development Dashboard** (`/dev`):
- Expects standard JSON response envelope
- Displays success/error status
- Shows provider, task, and result data
- Displays error messages and codes

**Production Endpoints**:
- Legacy `/generate` endpoint uses custom format
- Future endpoints will use standard envelope

---

## Contract Authority Rules

### Document Authority

This document defines the **official API contracts** for the FutureSelfApp platform. It has **higher authority** than:

- Implementation code (code should match contracts, not vice versa)
- Feature documentation (contracts define actual behavior)
- UX design documents (contracts define technical constraints)

**Rule**: When contract conflicts occur, this document takes precedence.

### Code Change Requirements

**Mandatory Updates**: Any endpoint change must update this document, including:

- New request/response fields
- Changed field types or validation rules
- New error codes
- Changed error structures
- New endpoints or removed endpoints
- Timeout value changes
- Content type changes

**Update Process**:
1. Identify which contract section is affected
2. Update the relevant schema and field specifications
3. Add examples if structure changes
4. Update version and last modified date

### Service Compliance Requirements

**All Services Must Comply**:
- UI must send requests matching these schemas
- Flask must validate and respond using these schemas
- Node.js bridge must accept and output these schemas
- AI providers must return data compatible with these schemas

**Validation**:
- Flask validates incoming requests against these contracts
- Node.js validates input against these contracts
- Errors are returned if contracts are violated

### Cursor Implementation Rules

**Cursor Must Not**:
- Invent payload structures outside this contract
- Add fields not documented in these schemas
- Use error codes not defined in error taxonomy
- Change response structures without updating this document
- Implement endpoints without contract documentation

**Cursor Must**:
- Follow exact field names and types specified
- Use documented error codes
- Maintain response envelope structure
- Update this document when adding new contracts
- Validate inputs against these schemas

---

## Contract Versioning

**Current Version**: 1.0

**Version History**:
- 1.0: Initial contract documentation

**Breaking Changes**:
- Breaking changes require version increment
- Breaking changes must be documented with migration guide
- Deprecated fields must be marked with deprecation notice

**Non-Breaking Changes**:
- Adding optional fields (non-breaking)
- Adding new error codes (non-breaking)
- Clarifying documentation (non-breaking)

---

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [Runtime Architecture](00-architecture-runtime.md)
- [Cursor Playbook](00-cursor-playbook.md)
