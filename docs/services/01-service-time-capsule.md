**Title**: AI Service Specification: The Time Capsule  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: AI Services, Backend, Frontend

---

# AI Service Specification: The Time Capsule

## Service Identity

### Service Name (Canonical)
**Name**: The Time Capsule

**Display Name**: The Time Capsule (user-facing name)

**Internal ID**: `time-capsule` (system identifier, lowercase with hyphens)

### Short Description
**One-Line Summary**: AI-powered photo aging service that generates a realistic aged self-portrait and a personalized wisdom letter from the user's "future self" based on their dreams and aspirations.

**Detailed Description**: 
```
The Time Capsule is an AI Service that combines photorealistic image aging with personalized text generation to create a meaningful, reflective experience for users. Users upload a photo of themselves and share their dreams or aspirations. The service uses advanced AI models to:

1. Age the photo realistically to show how the user would appear in 2050, maintaining recognizable facial features while incorporating natural aging characteristics
2. Generate a personalized 100-150 word wisdom letter from the user's "future self" that reflects on their current dreams and provides guidance

The service creates an emotional connection between users and their future selves, serving as both a visual keepsake and a source of motivation and reflection. It targets users aged 17-40 who are interested in personal growth, self-reflection, and future visualization.
```

### Primary User Goal
**User Objective**: Visualize their future self through AI-powered photo aging and receive personalized wisdom and guidance based on their current dreams and aspirations.

**Success Criteria**: User receives both a realistically aged photo showing themselves in 2050 and a personalized wisdom letter that reflects on their dreams and provides meaningful guidance.

### System Name / Internal ID
**System Identifier**: `time-capsule` (used in code, routes, file names)

**Route Prefix**: `/dashboard/time-capsule` (future), `/generate` (legacy endpoint)

**Node.js Module Path**: `src/ai_tools/toolkits/time-capsule/`

---

## Scope & Boundaries

### In Scope
- Photo aging transformation using Replicate Flux-dev model
- Wisdom letter generation using OpenAI GPT-4o-mini model
- Image file upload and validation (JPG, PNG formats)
- Text input for dreams/aspirations (100-500 words recommended)
- Combined output delivery (aged image URL + wisdom letter text)
- Legacy `/generate` endpoint support (form data)
- Standard `/dev/run` endpoint support (JSON)
- Error handling and user feedback
- Memory storage of outputs (when user account system is implemented)

### Out of Scope
- Video aging (only static images supported)
- Multiple age variations (only 2050 aging supported)
- Custom aging parameters (fixed aging algorithm)
- Letter tone customization (fixed warm, reflective tone)
- Real-time progress updates (synchronous processing)
- Batch processing (one image at a time)
- User account management (handled by account system)
- Credit consumption tracking (handled by billing system)

### Assumptions
- Users provide clear, front-facing photos for best results
- Users provide meaningful dream/aspiration text (not empty or spam)
- Image files are under 16MB and in supported formats
- Users have sufficient credits to execute the service (when billing is implemented)
- Network connectivity is available for API calls to Replicate and OpenAI
- Processing time of 30-60 seconds is acceptable to users

### Dependencies
**External Dependencies**:
- Replicate API (`black-forest-labs/flux-dev` model) for image aging
- OpenAI API (`gpt-4o-mini` model) for wisdom letter generation
- Replicate API token (`REPLICATE_API_TOKEN` environment variable)
- OpenAI API key (`OPENAI_API_KEY` environment variable)

**Internal Dependencies**:
- Flask backend (`app.py`) for request handling and routing
- Node.js bridge (`src/dev/run-ai-task.js`) for AI orchestration
- AI router (`src/ai/orchestration/ai.router.js`) for task routing
- Provider clients (`src/ai/providers/`) for API abstraction
- Environment loader (`src/core/env/env.loader.js`) for environment variable management

**Environment Dependencies**:
- `REPLICATE_API_TOKEN`: Required for Replicate API authentication
- `OPENAI_API_KEY`: Required for OpenAI API authentication
- `OPENAI_PROJECT_ID`: Optional, for project-based OpenAI API keys

---

## User Flow

### Entry Points in UI
**Primary Entry Point**: `/generate` route (legacy form-based interface)

**Alternative Entry Points**:
- `/dashboard/time-capsule` (future dashboard interface)
- `/dev/run` (development JSON API endpoint)

### Steps (User → System)

1. **User Action**: User navigates to Time Capsule interface and clicks "Generate" or submits form
   - System Response: System displays loading state and begins processing

2. **User Input**: User provides:
   - Image file (JPG or PNG, max 16MB) via file upload
   - Dream/aspiration text (100-500 words recommended) via text input
   - System Validation: System validates file format, size, and text length

3. **User Confirmation**: User clicks submit button (no additional confirmation required)
   - System Processing: 
     - Image uploaded to temporary storage
     - Image sent to Replicate API for aging transformation
     - Dream text sent to OpenAI API for wisdom letter generation
     - Both processes execute in parallel (when possible) or sequentially

4. **System Output**: System returns combined results:
   - Aged image URL (from Replicate)
   - Wisdom letter text (from OpenAI)
   - User Receives: Display of aged photo and wisdom letter in results area

### Exit States

**Success State**:
- Both image aging and letter generation complete successfully
- User sees aged photo displayed and wisdom letter text displayed
- Results are saved to memory (when account system is implemented)

**Error States**:
- **Image upload error**: User sees error message: "Please upload a valid image file (JPG or PNG, max 16MB)"
- **Text validation error**: User sees error message: "Please provide your dream or aspiration (100-500 words recommended)"
- **Replicate API error**: User sees error message: "Image processing failed. Please try again."
- **OpenAI API error**: User sees error message: "Letter generation failed. Please try again."
- **Timeout error**: User sees error message: "Processing took too long. Please try again."

**Partial Success States**:
- **Image success, letter failure**: User receives aged photo but sees error message for letter generation
- **Image failure, letter success**: User receives wisdom letter but sees error message for image processing

---

## Tools within the Service

### Tool List

This service contains the following tools:
1. Photo Aging Tool
2. Wisdom Letter Generation Tool

### Tool 1: Photo Aging Tool

#### Purpose
**Objective**: Transform a user's photo to realistically show how they would appear in 2050, maintaining recognizable facial features while incorporating natural aging characteristics.

**Use Case**: Users want to visualize their future self as motivation for long-term goals, create a keepsake, or engage in self-reflection about their future.

#### Inputs

**Required Inputs**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `image` | File | Yes | User's photo to be aged | Must be JPG or PNG, max 16MB, valid image format |
| `dream` | string | Yes | User's dream or aspiration text | Must be non-empty string, 10-2000 characters after trim |

**Optional Inputs**:
| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `target_year` | number | No | Target year for aging (currently fixed to 2050) | 2050 |

**File Inputs**:
| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `image` | File | Yes | Photo file to be aged | Max 16MB, JPG/PNG only, recommended: front-facing portrait, good lighting |

#### Outputs

**Success Output**:
| Field | Type | Description |
|-------|------|------------|
| `aged_image_url` | string | Public URL to the aged photo image |
| `processing_time` | number | Time taken for processing in seconds |

**Output Format**: JSON structure with image URL string

#### Constraints

**Processing Constraints**:
- Image must be processed through Replicate API (no local processing)
- Aging algorithm is fixed (no user customization)
- Target year is fixed to 2050 (no variation)
- Processing time: 30-60 seconds typical

**Resource Constraints**:
- Maximum image size: 16MB
- Supported formats: JPG, PNG only
- Image dimensions: No explicit limit, but very large images may timeout

**Time Constraints**:
- Expected processing time: 30-60 seconds
- Maximum timeout: 60 seconds (Flask subprocess timeout)
- Replicate API timeout: 120 seconds (model-specific)

#### Example Payload

**Request Payload** (via `/dev/run`):
```json
{
  "provider": "REPLICATE",
  "task": "IMAGE_GENERATION",
  "payload": {
    "image": "base64_encoded_image_data_or_url",
    "prompt": "Age this person to show how they would look in 2050, maintaining their recognizable features while incorporating natural aging. Consider their dream: [user's dream text]",
    "model": "black-forest-labs/flux-dev"
  }
}
```

**Success Response**:
```json
{
  "success": true,
  "result": {
    "provider": "REPLICATE",
    "task": "IMAGE_GENERATION",
    "success": true,
    "data": {
      "aged_image_url": "https://replicate.delivery/pbxt/.../output.png",
      "processing_time": 45.2
    }
  }
}
```

### Tool 2: Wisdom Letter Generation Tool

#### Purpose
**Objective**: Generate a personalized 100-150 word wisdom letter from the user's "future self" that reflects on their current dreams and provides guidance, motivation, and reflection.

**Use Case**: Users want to receive personalized advice and wisdom based on their aspirations, creating an emotional connection with their future self and gaining perspective on their goals.

#### Inputs

**Required Inputs**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `dream` | string | Yes | User's dream or aspiration text | Must be non-empty string, 10-2000 characters after trim |
| `user_context` | string | No | Additional context about the user (optional) | String, max 500 characters |

**Optional Inputs**:
| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `tone` | string | No | Letter tone (currently fixed to "warm, reflective, encouraging") | "warm, reflective, encouraging" |
| `length` | number | No | Target word count (currently fixed to 100-150 words) | 125 |

#### Outputs

**Success Output**:
| Field | Type | Description |
|-------|------|------------|
| `wisdom_letter` | string | Complete wisdom letter text (100-150 words) |
| `word_count` | number | Actual word count of generated letter |

**Output Format**: JSON structure with text string

#### Constraints

**Processing Constraints**:
- Letter must be 100-150 words (strictly enforced)
- Tone is fixed: warm, reflective, encouraging (no customization)
- Letter must reference user's dream/aspiration
- Letter must be written from perspective of "future self" in 2050

**Resource Constraints**:
- Maximum input text: 2000 characters
- Token limits: Input tokens limited by model context window
- Output tokens: Limited to generate 100-150 words

**Time Constraints**:
- Expected processing time: 3-5 seconds
- Maximum timeout: 10 seconds (provider-level)
- Subprocess timeout: 60 seconds (Flask-level)

#### Example Payload

**Request Payload** (via `/dev/run`):
```json
{
  "provider": "OPENAI",
  "task": "TEXT_GENERATION",
  "payload": {
    "prompt": "Write a personalized wisdom letter from my future self in 2050, reflecting on my current dream: [user's dream text]. The letter should be 100-150 words, warm, reflective, and encouraging.",
    "system": "You are a wise, reflective version of the user writing from the year 2050. Write a personalized letter that reflects on their current dreams and provides guidance, motivation, and perspective. Be warm, encouraging, and thoughtful.",
    "model": "gpt-4o-mini",
    "max_tokens": 300
  }
}
```

**Success Response**:
```json
{
  "success": true,
  "result": {
    "provider": "OPENAI",
    "task": "TEXT_GENERATION",
    "success": true,
    "data": {
      "wisdom_letter": "Dear [Current Self],\n\nAs I look back from 2050, I am filled with warmth thinking about the dreams you hold today. Your aspiration to [user's dream] has been a guiding light throughout these years...",
      "word_count": 127
    }
  }
}
```

---

## API Contracts

### Endpoints Involved

**Flask Endpoints**:
- `POST /generate`: Legacy form-based endpoint (multipart/form-data)
- `POST /dev/run`: Standard JSON API endpoint (application/json)

**Node.js Bridge**:
- Internal execution via: `src/dev/run-ai-task.js`
- Tool handler: `src/ai_tools/toolkits/time-capsule/handler.js` (future implementation)

### Request JSON Example

**Standard Request** (via `/dev/run`):
```json
{
  "provider": "OPENAI",
  "task": "TEXT_GENERATION",
  "payload": {
    "prompt": "Write a personalized wisdom letter from my future self in 2050, reflecting on my current dream: I want to start my own sustainable business and make a positive impact on the environment.",
    "system": "You are a wise, reflective version of the user writing from the year 2050. Write a personalized letter that reflects on their current dreams and provides guidance, motivation, and perspective. Be warm, encouraging, and thoughtful.",
    "model": "gpt-4o-mini",
    "max_tokens": 300
  }
}
```

**Legacy Request** (via `/generate` endpoint, multipart/form-data):
- Form field `image`: File upload (JPG/PNG, max 16MB)
- Form field `dream`: String text (user's dream/aspiration)

### Response JSON Example

**Success Response** (combined output from both tools):
```json
{
  "success": true,
  "result": {
    "provider": "TIME_CAPSULE",
    "task": "TIME_CAPSULE_GENERATION",
    "success": true,
    "data": {
      "aged_image_url": "https://replicate.delivery/pbxt/abc123.../output.png",
      "wisdom_letter": "Dear [Current Self],\n\nAs I look back from 2050, I am filled with warmth thinking about the dreams you hold today. Your aspiration to start a sustainable business has been a guiding light throughout these years. The path wasn't always easy, but your commitment to making a positive impact on the environment has created ripples of change that extend far beyond what you can imagine today.\n\nRemember that every small step matters. The sustainable practices you implement now will become the foundation of something greater. Trust in your vision, stay true to your values, and know that the future you are building is one worth fighting for.\n\nWith love and pride,\nYour Future Self (2050)",
      "word_count": 127,
      "processing_time": 48.5
    }
  }
}
```

**Legacy Success Response** (via `/generate` endpoint):
```json
{
  "success": true,
  "aged_image_url": "https://replicate.delivery/pbxt/abc123.../output.png",
  "wisdom_letter": "Dear [Current Self],\n\nAs I look back from 2050..."
}
```

**Partial Success Response** (if applicable):
```json
{
  "success": true,
  "result": {
    "provider": "TIME_CAPSULE",
    "task": "TIME_CAPSULE_GENERATION",
    "success": true,
    "data": {
      "aged_image_url": "https://replicate.delivery/pbxt/abc123.../output.png",
      "wisdom_letter": null,
      "word_count": 0,
      "processing_time": 48.5
    }
  }
}
```

### Error Examples

**Error Example 1: Validation Error**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Missing required field: dream text",
    "details": {
      "field": "dream",
      "reason": "Dream text is required and must be non-empty"
    },
    "statusCode": 400
  }
}
```

**Error Example 2: Provider Error (Replicate)**
```json
{
  "success": false,
  "error": {
    "code": "REPLICATE_ERROR",
    "message": "Replicate API error: Image processing failed",
    "details": {
      "originalError": "Model prediction failed",
      "status": 500
    },
    "statusCode": 400
  }
}
```

**Error Example 3: Execution Error (OpenAI)**
```json
{
  "success": false,
  "error": {
    "code": "OPENAI_ERROR",
    "message": "OpenAI API error: Rate limit exceeded",
    "details": {
      "provider": "OPENAI",
      "task": "TEXT_GENERATION",
      "originalError": "RATE_LIMIT_EXCEEDED"
    },
    "statusCode": 400
  }
}
```

**Error Example 4: Timeout Error**
```json
{
  "success": false,
  "error": {
    "code": "TIMEOUT",
    "message": "AI task timed out after 60 seconds",
    "details": {
      "provider": "REPLICATE",
      "task": "IMAGE_GENERATION",
      "timeout_seconds": 60
    },
    "statusCode": 504
  }
}
```

---

## AI Execution Rules

### Provider

**Primary Provider**: `REPLICATE` (for image aging), `OPENAI` (for wisdom letter)

**Fallback Providers** (if applicable):
- None currently implemented (single provider per tool)

**Provider Selection Logic**:
- Image aging always uses Replicate API with `black-forest-labs/flux-dev` model
- Wisdom letter generation always uses OpenAI API with `gpt-4o-mini` model
- No fallback logic currently implemented

### Model Selection Rules

**Default Model**: 
- Image aging: `black-forest-labs/flux-dev` (Replicate)
- Wisdom letter: `gpt-4o-mini` (OpenAI)

**Model Selection Criteria**:
- Image aging: Fixed to Flux-dev model (no alternatives)
- Wisdom letter: Fixed to GPT-4o-mini for cost efficiency (GPT-4o available but not used)

**Model Override** (if applicable):
- User can specify model: No (models are fixed)
- Allowed models: N/A (no user selection)

### Prompt Format Rules

**System Prompt Structure** (Wisdom Letter):
```
You are a wise, reflective version of the user writing from the year 2050. Write a personalized letter that reflects on their current dreams and provides guidance, motivation, and perspective. Be warm, encouraging, and thoughtful.

Requirements:
- 100-150 words exactly
- Written from perspective of "future self" in 2050
- Must reference the user's specific dream/aspiration
- Tone: warm, reflective, encouraging
- Format: Letter format with greeting and closing
```

**User Prompt Structure** (Wisdom Letter):
```
Write a personalized wisdom letter from my future self in 2050, reflecting on my current dream: [USER'S DREAM TEXT]

The letter should be 100-150 words, warm, reflective, and encouraging.
```

**Prompt Assembly Rules**:
- System prompt is static (never changes)
- User prompt includes the user's dream text verbatim
- Dream text is inserted directly into prompt (no sanitization beyond length limits)
- Prompt length is validated to fit within token limits

**Prompt Examples**:
- Example 1 (System Prompt): "You are a wise, reflective version of the user writing from the year 2050..."
- Example 2 (User Prompt): "Write a personalized wisdom letter from my future self in 2050, reflecting on my current dream: I want to start my own sustainable business and make a positive impact on the environment."

**Image Aging Prompt Structure**:
```
Age this person to show how they would look in 2050, maintaining their recognizable features while incorporating natural aging. Consider their dream: [USER'S DREAM TEXT]
```

### System Prompts vs User Prompts

**System Prompt**:
- Purpose: Defines the AI's role and writing style for wisdom letter generation
- Content: Instructions about being a "future self" in 2050, tone requirements, format requirements
- Static or Dynamic: Static (never changes)

**User Prompt**:
- Purpose: Contains the user's specific dream/aspiration and request for letter generation
- Content: User's dream text inserted into prompt template
- Source: User input from form field

### Token Limits (if applicable)

**Input Token Limits** (Wisdom Letter):
- Maximum input tokens: 2000 characters (approximately 500 tokens)
- Recommended input tokens: 100-500 characters (approximately 25-125 tokens)
- Truncation behavior: Dream text is truncated to 2000 characters if exceeded

**Output Token Limits** (Wisdom Letter):
- Maximum output tokens: 300 tokens (enforced via `max_tokens` parameter)
- Default output tokens: 300 tokens
- Truncation behavior: Letter is truncated if it exceeds 300 tokens (rare)

**Total Token Limits** (Wisdom Letter):
- Maximum total tokens (input + output): 8000 tokens (GPT-4o-mini context window)
- Model context window: 128000 tokens (GPT-4o-mini)

**Image Processing**:
- No token limits (image is processed as binary data, not tokens)

### Timeout Behavior

**Provider Timeout**: 
- Replicate API: 120 seconds (model-specific)
- OpenAI API: 10 seconds (HTTP request timeout)

**Subprocess Timeout**: 60 seconds (Flask-level)

**Timeout Handling**:
- If provider timeout: Provider returns timeout error, service returns error response to user
- If subprocess timeout: Flask raises `TimeoutExpired`, returns 504 error to user
- User experience: User sees timeout error message with option to retry

### Retries Behavior

**Retry Strategy**: No retries (fail immediately)

**Retry Conditions**:
- Rate limit errors: Fail immediately (no retry)
- Timeout errors: Fail immediately (no retry)
- API errors: Fail immediately (no retry)

**Retry Limits**:
- Maximum retries: 0 (no retries)
- Retry delay: N/A
- Backoff multiplier: N/A

**Retry Error Codes**:
- Codes that trigger retry: None (no retries)
- Codes that fail immediately: All error codes

---

## Validation & Safety

### Input Validation Rules

**Required Field Validation**:
- `image`: Must be present in form data or request, must be valid image file
- `dream`: Must be present and non-empty string after `.strip()`, must be 10-2000 characters

**Type Validation**:
- `image`: Must be File object (Flask `request.files`), reject if not file
- `dream`: Must be string, reject if not string or if empty after trim

**Range Validation**:
- `dream`: Must be between 10 and 2000 characters (after trim)
- Image file size: Must be between 1 byte and 16MB (16,777,216 bytes)

**File Validation**:
- File size: Maximum 16MB (16,777,216 bytes)
- File format: Allowed formats: JPG, JPEG, PNG
- File dimensions: No explicit limits, but very large images may cause timeouts
- File content: Must be valid image file (validated by image library)

**Cross-Field Validation**:
- Image and dream must both be provided (both required)
- No dependencies between image and dream content

### Content Safety Constraints

**Input Content Safety**:
- Prohibited content: No explicit content filtering (relies on provider moderation)
- Content filtering: Replicate and OpenAI have built-in content moderation
- Moderation: Provider-level moderation (Replicate and OpenAI filter inappropriate content)

**Output Content Safety**:
- Output validation: Wisdom letter is validated for length (100-150 words)
- Safety checks: Provider APIs perform safety checks (no additional checks)
- Content warnings: No content warnings (provider moderation handles this)

**User Data Safety**:
- PII handling: User photos and dream text are processed by third-party APIs (Replicate, OpenAI)
- Data retention: Temporary files are deleted after processing (no permanent storage)
- Privacy compliance: Users should be aware that images and text are sent to third-party APIs

### Rate Limiting Assumptions

**Rate Limiting Strategy**:
- Per-user limits: Not implemented (relies on credit system when implemented)
- Per-IP limits: Not implemented
- Global limits: Not implemented (relies on provider rate limits)

**Rate Limit Enforcement**:
- Where enforced: Provider APIs (Replicate and OpenAI enforce their own rate limits)
- Error response: Provider rate limit errors are returned to user as `REPLICATE_ERROR` or `OPENAI_ERROR`
- Reset behavior: Provider rate limits reset according to provider policies

### Abuse Prevention Notes

**Abuse Vectors**:
- Large file uploads: Prevented by 16MB file size limit
- Spam text input: Prevented by 2000 character limit and basic validation
- Rapid repeated requests: Not prevented (will be handled by credit system when implemented)

**Detection Mechanisms**:
- File size validation (prevents oversized uploads)
- Text length validation (prevents extremely long inputs)
- Basic input sanitization (prevents empty or whitespace-only inputs)

**Mitigation Actions**:
- Reject invalid files immediately (before API calls)
- Reject invalid text immediately (before API calls)
- Return clear error messages for validation failures

---

## Observability & Logging

### What Gets Logged

**Request Logging**:
- Request method and endpoint (POST /generate, POST /dev/run)
- File upload status (success/failure, file size)
- Dream text length (character count, not content)
- Request timestamp

**Execution Logging**:
- Replicate API call initiation and completion
- OpenAI API call initiation and completion
- Processing time for each tool (image aging, letter generation)
- Total processing time

**Response Logging**:
- Success/failure status
- Error codes (if failure)
- Response timestamp
- Output URLs (aged image URLs)

**Performance Logging**:
- Image processing time (Replicate API)
- Letter generation time (OpenAI API)
- Total end-to-end processing time
- API response times

### What Must Never Be Logged

**Sensitive Data**:
- API keys: Never logged (REPLICATE_API_TOKEN, OPENAI_API_KEY)
- User passwords: N/A (no passwords in this service)
- PII: User photos and dream text content should not be logged in full (only metadata)
- API request/response bodies: Should not be logged in production (contains user data)

**Logging Constraints**:
- No logging of full image data (only URLs and metadata)
- No logging of full dream text content (only length and validation status)
- No logging of API keys or tokens

### Debug Flags and Safe Diagnostics

**Debug Mode**:
- Enable flag: `DEBUG=true` environment variable (if implemented)
- Debug output: Request/response details, API call details, processing times
- Debug location: `process.stderr` (Node.js) or Flask logs

**Safe Diagnostics**:
- Environment check: API key presence (boolean, not values)
- Configuration check: Model names, timeout values
- Status check: API availability, processing status

**Diagnostic Endpoints** (if applicable):
- `/dev/env`: Returns environment variable status (development only)
- `/dev/run`: Test endpoint for service execution (development only)

---

## Acceptance Criteria

### Definition of Done Checklist

**Functional Requirements**:
- [x] All tools within service are implemented (Photo Aging, Wisdom Letter Generation)
- [x] All inputs are validated (image file, dream text)
- [x] All outputs match specification (aged image URL, wisdom letter text)
- [x] Error handling is complete (validation errors, API errors, timeout errors)
- [x] User flow is end-to-end functional (form submission to results display)

**Technical Requirements**:
- [x] API contracts are implemented (legacy `/generate` endpoint)
- [x] AI execution rules are followed (Replicate for images, OpenAI for text)
- [x] Validation and safety rules are enforced (file size, format, text length)
- [ ] Observability is implemented (basic logging exists, full observability pending)
- [x] Code follows architecture patterns (Flask → Node.js → AI Providers)

**Quality Requirements**:
- [ ] Tests are written and passing (tests pending)
- [x] Documentation is complete (this specification)
- [ ] Performance meets SLA (30-60 seconds typical, acceptable)
- [ ] Security review is complete (security review pending)
- [x] Error messages are user-friendly (clear error messages implemented)

### Required Tests

**Unit Tests**:
- Image file validation: Test file size limits, format validation, invalid file rejection
- Dream text validation: Test length limits, empty text rejection, whitespace handling
- API response parsing: Test success response parsing, error response parsing

**Integration Tests**:
- Replicate API integration: Test image upload, prediction creation, result retrieval
- OpenAI API integration: Test text generation, prompt formatting, response parsing
- End-to-end service flow: Test complete flow from form submission to results display

**End-to-End Tests**:
- Complete user flow: Upload image, enter dream, receive results
- Error handling flow: Invalid input, API failure, timeout scenarios
- Legacy endpoint compatibility: Test `/generate` endpoint with form data

**Error Case Tests**:
- Invalid image file: Test rejection of non-image files, oversized files, unsupported formats
- Invalid dream text: Test rejection of empty text, overly long text
- API failures: Test handling of Replicate API errors, OpenAI API errors
- Timeout scenarios: Test handling of subprocess timeouts, provider timeouts

### Expected Performance (Basic SLA Statement)

**Response Time**:
- P50 (median): 45 seconds
- P95: 60 seconds
- P99: 65 seconds
- Maximum: 60 seconds (Flask subprocess timeout)

**Throughput**:
- Requests per second: 1-2 (limited by processing time)
- Concurrent requests: Limited by Flask subprocess execution (sequential processing)

**Reliability**:
- Success rate: 95% (target, accounting for API failures and timeouts)
- Error rate: 5% (target, includes validation errors, API errors, timeouts)
- Availability: 99% (target, depends on Replicate and OpenAI API availability)

**Resource Usage**:
- Memory: Moderate (temporary file storage, image processing)
- CPU: Low (mostly I/O bound, API calls)
- Network: Moderate (image uploads to Replicate, API calls to OpenAI)

---

## Versioning

### Spec Version

**Current Version**: 1.0.0

**Version Format**: `MAJOR.MINOR.PATCH`
- Major: Breaking changes (e.g., removing tools, changing required inputs)
- Minor: Non-breaking feature additions (e.g., adding optional parameters, new output fields)
- Patch: Bug fixes and clarifications (e.g., fixing documentation errors, clarifying constraints)

### Change Log

**Version History**:
- 1.0.0 - 2024-12-19: Initial service specification creation

**Upcoming Changes**:
- Migration from legacy `/generate` endpoint to standard `/dev/run` endpoint
- Addition of user account integration for memory storage
- Addition of credit consumption tracking
- Potential addition of multiple age variations (2030, 2040, 2050)

### Backward Compatibility Notes

**Compatibility Policy**:
- Legacy `/generate` endpoint will be maintained until migration is complete
- Standard `/dev/run` endpoint will be the primary interface going forward
- Response formats may evolve, but core structure (aged_image_url, wisdom_letter) will remain

**Breaking Changes**:
- None currently planned

**Deprecation Notices**:
- Legacy `/generate` endpoint: Will be deprecated in favor of `/dev/run` endpoint (timeline TBD)
- Form data format: Will be deprecated in favor of JSON format (timeline TBD)

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [API Contracts](00-api-contracts.md)
- [Runtime Architecture](00-architecture-runtime.md)
- [Service Specification Template](00-service-spec-template.md)
