**Title**: AI Service Specification: Instant Influencer  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: AI Services, Backend, Frontend

---

# AI Service Specification: Instant Influencer

## Service Identity

### Service Name (Canonical)
**Name**: Instant Influencer

**Display Name**: Instant Influencer (user-facing name)

**Internal ID**: `instant-influencer` (system identifier, lowercase with hyphens)

### Short Description
**One-Line Summary**: AI-powered professional headshot generation service that creates studio-quality professional photos from user-uploaded images in multiple style variations.

**Detailed Description**: 
```
Instant Influencer is an AI Service that generates professional headshots from user-uploaded photos using advanced AI image generation models. Users upload a photo of themselves and select a professional style preference (corporate, creative, casual, formal). The service uses AI models to:

1. Analyze the user's uploaded photo to identify facial features, lighting, and composition
2. Generate multiple professional headshot variations (3-5 images) with studio-quality lighting and backgrounds
3. Apply the selected style preference while maintaining recognizable facial features
4. Produce high-resolution output images suitable for professional use

The service targets users aged 18-35 who need professional headshots for LinkedIn profiles, portfolios, social media, dating profiles, or business purposes. It enables users to obtain professional-quality photos without hiring a photographer, scheduling sessions, or paying for professional photography services. The service provides quick turnaround (45-90 seconds) and cost-effective professional image generation.
```

### Primary User Goal
**User Objective**: Generate professional-quality headshot photos in multiple style variations for use in professional profiles, portfolios, social media, or business purposes.

**Success Criteria**: User receives 3-5 high-quality professional headshot image URLs that maintain recognizable facial features while applying professional styling, lighting, and backgrounds appropriate to the selected style preference.

### System Name / Internal ID
**System Identifier**: `instant-influencer` (used in code, routes, file names)

**Route Prefix**: `/dashboard/instant-influencer` (future), `/generate/influencer` (planned endpoint)

**Node.js Module Path**: `src/ai_tools/toolkits/instant-influencer/`

---

## Scope & Boundaries

### In Scope
- Professional headshot generation using Replicate Flux-dev model
- Multiple style variations (corporate, creative, casual, formal)
- Multiple output images per request (3-5 headshots)
- Image file upload and validation (JPG, PNG formats)
- Style preference selection (corporate, creative, casual, formal)
- High-resolution output generation (4K+ resolution)
- Studio-quality lighting and composition
- Professional background options
- Standard `/dev/run` endpoint support (JSON)
- Error handling and user feedback
- Memory storage of outputs (when user account system is implemented)

### Out of Scope
- Video headshot generation (only static images supported)
- Custom background uploads (AI-generated backgrounds only)
- Manual editing or post-processing adjustments
- Real-time preview or interactive editing
- Batch processing of multiple users simultaneously
- Custom model training or fine-tuning
- User-provided reference images for style transfer
- User account management (handled by account system)
- Credit consumption tracking (handled by billing system)

### Assumptions
- Users provide clear, front-facing photos for best results
- Users understand that generated headshots are AI-generated and may vary in quality
- Image files are under 16MB and in supported formats
- Users have sufficient credits to execute the service (when billing is implemented)
- Network connectivity is available for API calls to Replicate
- Processing time of 45-90 seconds is acceptable to users
- Users select appropriate style preference for their intended use case

### Dependencies
**External Dependencies**:
- Replicate API (`black-forest-labs/flux-dev` model) for professional headshot generation
- Replicate API token (`REPLICATE_API_TOKEN` environment variable)

**Internal Dependencies**:
- Flask backend (`app.py`) for request handling and routing
- Node.js bridge (`src/dev/run-ai-task.js`) for AI orchestration
- AI router (`src/ai/orchestration/ai.router.js`) for task routing
- Provider clients (`src/ai/providers/`) for API abstraction
- Environment loader (`src/core/env/env.loader.js`) for environment variable management

**Environment Dependencies**:
- `REPLICATE_API_TOKEN`: Required for Replicate API authentication

---

## User Flow

### Entry Points in UI
**Primary Entry Point**: `/dashboard/instant-influencer` route (future dashboard interface)

**Alternative Entry Points**:
- `/generate/influencer` (planned production endpoint)
- `/dev/run` (development JSON API endpoint)

### Steps (User → System)

1. **User Action**: User navigates to Instant Influencer interface and selects image upload option
   - System Response: System displays upload interface and begins file selection

2. **User Input**: User provides:
   - Image file (JPG or PNG, max 16MB) via file upload
   - Style preference selection (corporate, creative, casual, or formal) via dropdown or button selection
   - System Validation: System validates file format, size, and style selection

3. **User Confirmation**: User clicks submit button (no additional confirmation required)
   - System Processing: 
     - Image uploaded to temporary storage
     - Image sent to Replicate API with professional headshot prompt
     - Style preference incorporated into generation prompt
     - Multiple headshot variations generated (3-5 images)
     - Processing executes (45-90 seconds typical)
     - Generated headshots stored and URLs returned

4. **System Output**: System returns generation results:
   - Array of professional headshot image URLs (3-5 images)
   - Processing metadata (processing time, model used, style applied)
   - User Receives: Display of generated headshots in results area with download options for each image

### Exit States

**Success State**:
- Headshot generation completes successfully
- User sees 3-5 professional headshot images displayed
- Results are saved to memory (when account system is implemented)

**Error States**:
- **Image upload error**: User sees error message: "Please upload a valid image file (JPG or PNG, max 16MB)"
- **Style selection error**: User sees error message: "Please select a style preference (corporate, creative, casual, or formal)"
- **API processing error**: User sees error message: "Headshot generation failed. Please try again or contact support."
- **Timeout error**: User sees error message: "Processing took too long. Please try again with a smaller image or different style."

**Partial Success States**:
- **Partial generation**: If fewer than 3 headshots are generated, user receives available images with a warning message indicating partial results

---

## Tools within the Service

### Tool List

This service contains the following tools:
1. Professional Headshot Generation Tool

### Tool 1: Professional Headshot Generation Tool

#### Purpose
**Objective**: Generate 3-5 professional-quality headshot images from a user-uploaded photo, applying selected style preferences (corporate, creative, casual, formal) while maintaining recognizable facial features.

**Use Case**: Users need professional headshots for LinkedIn profiles, portfolios, social media, dating profiles, or business purposes without hiring a photographer or scheduling photography sessions.

#### Inputs

**Required Inputs**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `image` | File or string | Yes | User's photo file (JPG/PNG) or base64-encoded image data | Must be valid image file (JPG/PNG), max 16MB, or valid base64 string |
| `style` | string | Yes | Professional style preference | Must be one of: "corporate", "creative", "casual", "formal" |

**Optional Inputs**:
| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `num_variations` | number | No | Number of headshot variations to generate | 3 |
| `background_type` | string | No | Background style preference (neutral, professional, modern) | "professional" |

**File Inputs**:
| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `image` | File | Yes | User's photo file | Max 16MB, JPG or PNG format, recommended: front-facing portrait, clear lighting |

#### Outputs

**Success Output**:
| Field | Type | Description |
|-------|------|------------|
| `headshot_urls` | array<string> | Array of 3-5 professional headshot image URLs |
| `style_applied` | string | Style preference that was applied |
| `processing_time` | number | Total processing time in seconds |
| `num_generated` | number | Number of headshots successfully generated |

**Output Format**: JSON structure with array of image URLs

#### Constraints

**Processing Constraints**:
- Must generate minimum 3 headshots (target: 3-5)
- Style must be one of: corporate, creative, casual, formal
- Facial features must remain recognizable
- Output images must be high-resolution (4K+)
- Studio-quality lighting and composition required

**Resource Constraints**:
- Maximum image size: 16MB
- Supported formats: JPG, PNG only
- Image dimensions: No explicit limit, but very large images may timeout
- Maximum variations: 5 headshots per request

**Time Constraints**:
- Expected processing time: 45-90 seconds
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
    "prompt": "Professional headshot, [style] style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features",
    "style": "corporate",
    "num_variations": 3,
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
      "headshot_urls": [
        "https://replicate.delivery/pbxt/abc123.../output_1.png",
        "https://replicate.delivery/pbxt/abc123.../output_2.png",
        "https://replicate.delivery/pbxt/abc123.../output_3.png"
      ],
      "style_applied": "corporate",
      "processing_time": 67.3,
      "num_generated": 3
    }
  }
}
```

---

## API Contracts

### Endpoints Involved

**Flask Endpoints**:
- `POST /generate/influencer`: Planned production endpoint (multipart/form-data or JSON)
- `POST /dev/run`: Standard JSON API endpoint (application/json)

**Node.js Bridge**:
- Internal execution via: `src/dev/run-ai-task.js`
- Tool handler: `src/ai_tools/toolkits/instant-influencer/handler.js` (future implementation)

### Request JSON Example

**Standard Request** (via `/dev/run`):
```json
{
  "provider": "REPLICATE",
  "task": "IMAGE_GENERATION",
  "payload": {
    "image": "base64_encoded_image_data_or_url",
    "prompt": "Professional headshot, corporate style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features",
    "style": "corporate",
    "num_variations": 3,
    "model": "black-forest-labs/flux-dev"
  }
}
```

**Production Request** (via `/generate/influencer`, multipart/form-data):
- Form field `image`: File upload (JPG/PNG, max 16MB)
- Form field `style`: String selection ("corporate", "creative", "casual", "formal")

### Response JSON Example

**Success Response**:
```json
{
  "success": true,
  "result": {
    "provider": "REPLICATE",
    "task": "IMAGE_GENERATION",
    "success": true,
    "data": {
      "headshot_urls": [
        "https://replicate.delivery/pbxt/abc123.../output_1.png",
        "https://replicate.delivery/pbxt/abc123.../output_2.png",
        "https://replicate.delivery/pbxt/abc123.../output_3.png"
      ],
      "style_applied": "corporate",
      "processing_time": 67.3,
      "num_generated": 3
    }
  }
}
```

**Partial Success Response** (if fewer than requested headshots generated):
```json
{
  "success": true,
  "result": {
    "provider": "REPLICATE",
    "task": "IMAGE_GENERATION",
    "success": true,
    "data": {
      "headshot_urls": [
        "https://replicate.delivery/pbxt/abc123.../output_1.png",
        "https://replicate.delivery/pbxt/abc123.../output_2.png"
      ],
      "style_applied": "corporate",
      "processing_time": 67.3,
      "num_generated": 2,
      "warnings": ["Only 2 headshots generated (requested 3)"]
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
    "message": "Missing required field: style preference",
    "details": {
      "field": "style",
      "reason": "Style must be one of: corporate, creative, casual, formal"
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

**Error Example 3: Execution Error**
```json
{
  "success": false,
  "error": {
    "code": "AI_TASK_FAILED",
    "message": "Headshot generation failed: Unable to generate professional headshots",
    "details": {
      "provider": "REPLICATE",
      "task": "IMAGE_GENERATION",
      "originalError": "IMAGE_PROCESSING_FAILED"
    },
    "statusCode": 500
  }
}
```

---

## AI Execution Rules

### Provider

**Primary Provider**: `REPLICATE` (for professional headshot generation)

**Fallback Providers** (if applicable):
- None currently implemented (single provider)

**Provider Selection Logic**:
- Professional headshot generation always uses Replicate API with `black-forest-labs/flux-dev` model
- No fallback logic currently implemented

### Model Selection Rules

**Default Model**: `black-forest-labs/flux-dev` (Replicate)

**Model Selection Criteria**:
- Fixed to Flux-dev model for professional headshot generation
- No alternative models currently supported

**Model Override** (if applicable):
- User cannot specify model (fixed to Flux-dev)
- Model selection is service-controlled

### Prompt Format Rules

**System Prompt Structure**:
```
Not applicable - Replicate Flux-dev uses direct image-to-image generation with text prompts, not system/user prompt structure.
```

**User Prompt Structure**:
```
"Professional headshot, [STYLE] style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features"
```

Where `[STYLE]` is replaced with:
- "corporate" → "corporate, business professional, formal attire, executive"
- "creative" → "creative, artistic, modern, contemporary"
- "casual" → "casual, relaxed, friendly, approachable"
- "formal" → "formal, elegant, sophisticated, traditional"

**Prompt Assembly Rules**:
- Base prompt template is fixed: "Professional headshot, [STYLE] style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features"
- Style placeholder is replaced with style-specific descriptors
- User's uploaded image is provided as input image (not in prompt text)
- Prompt is constructed in Node.js handler before API call

**Prompt Examples**:
- Corporate style: "Professional headshot, corporate, business professional, formal attire, executive style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features"
- Creative style: "Professional headshot, creative, artistic, modern, contemporary style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features"

### System Prompts vs User Prompts

**System Prompt**:
- Purpose: Not applicable for Replicate Flux-dev (uses direct image-to-image generation)
- Content: N/A
- Static or Dynamic: N/A

**User Prompt**:
- Purpose: Describes the desired professional headshot style and quality requirements
- Content: Style preference, quality specifications, composition requirements
- Source: Constructed by service handler based on user's style selection

### Token Limits (if applicable)

**Input Token Limits**:
- Not applicable (image-to-image generation, not text-based)
- Image size limit: 16MB

**Output Token Limits**:
- Not applicable (image generation, not text)
- Output image resolution: 4K+ (4096x4096 or higher)

**Total Token Limits**:
- Not applicable for image generation
- Model context: Image-based, not token-based

### Timeout Behavior

**Provider Timeout**: 120 seconds (Replicate API model-specific timeout)

**Subprocess Timeout**: 60 seconds (Flask-level)

**Timeout Handling**:
- If provider timeout: Replicate API returns timeout error, service returns error response to user
- If subprocess timeout: Flask terminates Node.js process, returns timeout error to user
- User experience: User sees timeout error message with suggestion to retry with smaller image or different style

### Retries Behavior

**Retry Strategy**: No automatic retries (single attempt per request)

**Retry Conditions**:
- Transient API errors: No retry (user must retry manually)
- Timeout errors: No retry (user must retry manually)
- Validation errors: No retry (user must fix input)

**Retry Limits**:
- Maximum retries: 0 (no automatic retries)
- Retry delay: N/A
- Backoff multiplier: N/A

**Retry Error Codes**:
- Codes that trigger retry: None (no retries implemented)
- Codes that fail immediately: All error codes fail immediately

---

## Validation & Safety

### Input Validation Rules

**Required Field Validation**:
- `image`: Must be present, valid image file (JPG/PNG), max 16MB, or valid base64-encoded string
- `style`: Must be present and one of: "corporate", "creative", "casual", "formal"

**Type Validation**:
- `image`: Must be File object, URL string, or base64-encoded string
- `style`: Must be string type, case-insensitive matching
- `num_variations`: Must be number between 1 and 5 (if provided)

**Range Validation**:
- `num_variations`: Must be between 1 and 5 (default: 3)
- Image file size: Must be between 1KB and 16MB
- Image dimensions: Recommended minimum 512x512 pixels, no maximum (but very large images may timeout)

**File Validation**:
- File size: Maximum 16MB
- File format: Allowed formats: JPG, JPEG, PNG
- File dimensions: No explicit limits, but very large images may cause timeouts
- File content: Must be valid image file (not corrupted, not text file renamed)

**Cross-Field Validation**:
- If `style` is provided, it must match one of the allowed values (case-insensitive)
- If `num_variations` exceeds 5, it is capped at 5

### Content Safety Constraints

**Input Content Safety**:
- Prohibited content: No explicit content filtering (assumes users upload appropriate photos)
- Content filtering: Basic image format validation only
- Moderation: No content moderation implemented (relies on user responsibility)

**Output Content Safety**:
- Output validation: Generated images are returned as-is from Replicate API
- Safety checks: No explicit safety checks on generated headshots
- Content warnings: No content warnings (assumes professional use case)

**User Data Safety**:
- PII handling: User-uploaded images may contain PII (facial features); images are processed by third-party API (Replicate)
- Data retention: Generated headshots stored in Replicate's temporary storage; URLs expire after Replicate's retention period
- Privacy compliance: Users should be informed that images are processed by third-party AI service

### Rate Limiting Assumptions

**Rate Limiting Strategy**:
- Per-user limits: Not implemented (handled by billing/credit system when implemented)
- Per-IP limits: Not implemented (handled by billing/credit system when implemented)
- Global limits: Not implemented (handled by billing/credit system when implemented)

**Rate Limit Enforcement**:
- Where enforced: Not currently enforced (will be handled by billing system)
- Error response: N/A (rate limiting not implemented)
- Reset behavior: N/A (rate limiting not implemented)

### Abuse Prevention Notes

**Abuse Vectors**:
- Excessive requests: Prevented by credit/billing system (when implemented)
- Invalid image uploads: Prevented by file validation
- Style manipulation: Prevented by style validation (must be one of allowed values)

**Detection Mechanisms**:
- File validation detects invalid formats
- Style validation detects invalid style selections
- Credit system (when implemented) tracks usage per user

**Mitigation Actions**:
- Invalid inputs return validation errors immediately
- Credit system (when implemented) prevents excessive usage
- Error logging tracks failed requests for analysis

---

## Observability & Logging

### What Gets Logged

**Request Logging**:
- Request timestamp
- User-provided style preference
- Image file metadata (size, format, dimensions if available)
- Number of variations requested

**Execution Logging**:
- Replicate API call initiation
- Processing start time
- Style applied
- Number of variations requested
- Replicate API response status

**Response Logging**:
- Number of headshots successfully generated
- Processing time
- Success/failure status
- Error codes (if applicable)

**Performance Logging**:
- Total processing time (end-to-end)
- Replicate API call duration
- Image upload time (if applicable)
- Time to first headshot URL

### What Must Never Be Logged

**Sensitive Data**:
- API keys: Never logged (Replicate API token)
- User-uploaded image data: Never logged (base64-encoded images, file contents)
- Generated headshot image data: Never logged (only URLs logged)
- User personal information: Never logged (except anonymized metadata)

**Logging Constraints**:
- No image file contents in logs
- No base64-encoded image data in logs
- No API keys or tokens in logs
- User-uploaded images are not stored permanently (temporary storage only)

### Debug Flags and Safe Diagnostics

**Debug Mode**:
- Enable flag: `DEBUG_INSTANT_INFLUENCER` environment variable (if implemented)
- Debug output: Request metadata, processing steps, API call details (without sensitive data)
- Debug location: `process.stderr` (Node.js bridge logging)

**Safe Diagnostics**:
- Environment check: Replicate API token presence (boolean only, not the token value)
- Configuration check: Style options available, model name, default settings
- Status check: Service availability, last successful request timestamp

**Diagnostic Endpoints** (if applicable):
- `/dev/influencer/status`: Returns service status, configuration (without sensitive data)
- `/dev/influencer/config`: Returns available style options, model information

---

## Acceptance Criteria

### Definition of Done Checklist

**Functional Requirements**:
- [ ] Professional headshot generation tool is implemented
- [ ] All inputs are validated (image file, style preference)
- [ ] All outputs match specification (array of headshot URLs, metadata)
- [ ] Error handling is complete (validation errors, API errors, timeout errors)
- [ ] User flow is end-to-end functional (upload → process → display results)

**Technical Requirements**:
- [ ] API contracts are implemented (request/response schemas)
- [ ] AI execution rules are followed (Replicate API integration, prompt construction)
- [ ] Validation and safety rules are enforced (file validation, style validation)
- [ ] Observability is implemented (logging, error tracking)
- [ ] Code follows architecture patterns (Flask → Node.js → Replicate flow)

**Quality Requirements**:
- [ ] Tests are written and passing (unit tests, integration tests)
- [ ] Documentation is complete (this specification)
- [ ] Performance meets SLA (45-90 seconds processing time)
- [ ] Security review is complete (no sensitive data in logs, proper validation)
- [ ] Error messages are user-friendly (clear, actionable error messages)

### Required Tests

**Unit Tests**:
- Input validation: Test image file validation, style validation, num_variations validation
- Prompt construction: Test prompt assembly with different style preferences
- Error handling: Test error response formatting

**Integration Tests**:
- Replicate API integration: Test successful headshot generation
- Error scenarios: Test API errors, timeout errors, invalid inputs
- Multiple variations: Test generation of 3-5 headshots

**End-to-End Tests**:
- Complete user flow: Upload image → select style → receive headshots
- Error recovery: Test user experience with various error scenarios
- Performance: Test processing time within expected range (45-90 seconds)

**Error Case Tests**:
- Invalid image format: Test rejection of unsupported file formats
- Invalid style selection: Test rejection of invalid style values
- API failures: Test handling of Replicate API errors
- Timeout scenarios: Test handling of processing timeouts

### Expected Performance (Basic SLA Statement)

**Response Time**:
- P50 (median): 60 seconds
- P95: 85 seconds
- P99: 90 seconds
- Maximum: 90 seconds (target), 120 seconds (hard limit)

**Throughput**:
- Requests per second: 1-2 (limited by Replicate API processing time)
- Concurrent requests: Limited by Replicate API rate limits

**Reliability**:
- Success rate: 95% (target)
- Error rate: 5% (target, including user errors and API errors)
- Availability: 99% (target, excluding Replicate API downtime)

**Resource Usage**:
- Memory: Minimal (image processing handled by Replicate API)
- CPU: Minimal (orchestration only, no local image processing)
- Network: Moderate (image upload to Replicate, headshot URL retrieval)

---

## Versioning

### Spec Version

**Current Version**: `1.0.0`

**Version Format**: `<MAJOR>.<MINOR>.<PATCH>`
- Major: Breaking changes (e.g., removing required fields, changing response structure)
- Minor: Non-breaking feature additions (e.g., adding new style options, new optional fields)
- Patch: Bug fixes and clarifications (e.g., fixing documentation errors, clarifying validation rules)

### Change Log

**Version History**:
- `1.0.0` - `2024-12-19`: Initial service specification created

**Upcoming Changes**:
- Additional style options (e.g., "artistic", "sporty")
- Custom background options
- Video headshot generation (future consideration)

### Backward Compatibility Notes

**Compatibility Policy**:
- API contracts maintain backward compatibility within major version
- New optional fields may be added without breaking changes
- Response structure remains consistent (array of headshot URLs)

**Breaking Changes**:
- Removing required fields: Would require major version increment and migration guide
- Changing response structure: Would require major version increment and migration guide
- Removing style options: Would require major version increment and migration guide

**Deprecation Notices**:
- None currently (service not yet implemented)

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [API Contracts](00-api-contracts.md)
- [Runtime Architecture](00-architecture-runtime.md)
