**Title**: AI Service Specification Template  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Services, Documentation

---

# AI Service Specification Template: <SERVICE_NAME>

## Service Identity

### Service Name (Canonical)
**Name**: `<SERVICE_NAME>`

**Display Name**: `<DISPLAY_NAME>` (user-facing name)

**Internal ID**: `<SERVICE_ID>` (system identifier, lowercase with hyphens)

### Short Description
**One-Line Summary**: `<One sentence describing what this service does>`

**Detailed Description**: 
```
<2-3 paragraph description of the service, its purpose, and value proposition>
```

### Primary User Goal
**User Objective**: `<What the user is trying to achieve when using this service>`

**Success Criteria**: `<How the user knows the service succeeded>`

### System Name / Internal ID
**System Identifier**: `<SERVICE_ID>` (used in code, routes, file names)

**Route Prefix**: `<ROUTE_PREFIX>` (e.g., `/dashboard/<service-id>`)

**Node.js Module Path**: `<MODULE_PATH>` (e.g., `src/ai_tools/toolkits/<service-id>/`)

---

## Scope & Boundaries

### In Scope
- `<Feature or capability that is included>`
- `<Feature or capability that is included>`
- `<Feature or capability that is included>`

### Out of Scope
- `<Feature or capability that is explicitly NOT included>`
- `<Feature or capability that is explicitly NOT included>`
- `<Feature or capability that is explicitly NOT included>`

### Assumptions
- `<Assumption about user behavior, data, or system state>`
- `<Assumption about user behavior, data, or system state>`
- `<Assumption about user behavior, data, or system state>`

### Dependencies
**External Dependencies**:
- `<External service, API, or library required>`
- `<External service, API, or library required>`

**Internal Dependencies**:
- `<Internal module, service, or component required>`
- `<Internal module, service, or component required>`

**Environment Dependencies**:
- `<Environment variable required>`
- `<Environment variable required>`

---

## User Flow

### Entry Points in UI
**Primary Entry Point**: `<Route or UI location where service is accessed>`

**Alternative Entry Points**:
- `<Alternative route or UI location>`
- `<Alternative route or UI location>`

### Steps (User → System)

1. **User Action**: `<What the user does to initiate the service>`
   - System Response: `<What the system does in response>`

2. **User Input**: `<What data or input the user provides>`
   - System Validation: `<How the system validates the input>`

3. **User Confirmation**: `<Any confirmation or action required from user>`
   - System Processing: `<What happens during processing>`

4. **System Output**: `<What the system returns to the user>`
   - User Receives: `<What the user sees or receives>`

### Exit States

**Success State**:
- `<Condition that indicates successful completion>`
- `<What user sees in success state>`

**Error States**:
- `<Error condition 1>`: `<What user sees>`
- `<Error condition 2>`: `<What user sees>`
- `<Error condition 3>`: `<What user sees>`

**Partial Success States**:
- `<Condition for partial success>`: `<What user sees>`

---

## Tools within the Service

### Tool List

This service contains the following tools:
1. `<TOOL_1_NAME>`
2. `<TOOL_2_NAME>`
3. `<TOOL_N_NAME>`

### Tool 1: <TOOL_1_NAME>

#### Purpose
**Objective**: `<What this tool accomplishes>`

**Use Case**: `<When and why users would use this tool>`

#### Inputs

**Required Inputs**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `<FIELD_1>` | `<TYPE>` | Yes | `<Description>` | `<Validation rule>` |
| `<FIELD_2>` | `<TYPE>` | Yes | `<Description>` | `<Validation rule>` |

**Optional Inputs**:
| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `<FIELD_3>` | `<TYPE>` | No | `<Description>` | `<Default value>` |

**File Inputs** (if applicable):
| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `<FILE_FIELD>` | File | Yes/No | `<Description>` | `<Size, format, dimension limits>` |

#### Outputs

**Success Output**:
| Field | Type | Description |
|-------|------|------------|
| `<OUTPUT_FIELD_1>` | `<TYPE>` | `<Description>` |
| `<OUTPUT_FIELD_2>` | `<TYPE>` | `<Description>` |

**Output Format**: `<JSON structure, file type, or data format>`

#### Constraints

**Processing Constraints**:
- `<Constraint 1>`: `<Limit or rule>`
- `<Constraint 2>`: `<Limit or rule>`

**Resource Constraints**:
- `<Resource constraint 1>`: `<Limit>`
- `<Resource constraint 2>`: `<Limit>`

**Time Constraints**:
- Expected processing time: `<TIME_RANGE>`
- Maximum timeout: `<TIMEOUT_VALUE>`

#### Example Payload

**Request Payload**:
```json
{
  "provider": "<PROVIDER_NAME>",
  "task": "<TASK_TYPE>",
  "payload": {
    "<FIELD_1>": "<EXAMPLE_VALUE>",
    "<FIELD_2>": "<EXAMPLE_VALUE>",
    "<FIELD_3>": "<EXAMPLE_VALUE>"
  }
}
```

**Success Response**:
```json
{
  "success": true,
  "result": {
    "provider": "<PROVIDER_NAME>",
    "task": "<TASK_TYPE>",
    "success": true,
    "data": {
      "<OUTPUT_FIELD_1>": "<EXAMPLE_VALUE>",
      "<OUTPUT_FIELD_2>": "<EXAMPLE_VALUE>"
    }
  }
}
```

### Tool 2: <TOOL_2_NAME>

[Repeat structure from Tool 1]

### Tool N: <TOOL_N_NAME>

[Repeat structure from Tool 1]

---

## API Contracts

### Endpoints Involved

**Flask Endpoints**:
- `<METHOD> <ENDPOINT_PATH>`: `<Purpose>`
- `<METHOD> <ENDPOINT_PATH>`: `<Purpose>`

**Node.js Bridge**:
- Internal execution via: `src/dev/run-ai-task.js`
- Tool handler: `src/ai_tools/toolkits/<SERVICE_ID>/handler.js`

### Request JSON Example

**Standard Request** (via `/dev/run`):
```json
{
  "provider": "<PROVIDER_NAME>",
  "task": "<TASK_TYPE>",
  "payload": {
    "<PAYLOAD_FIELD_1>": "<VALUE>",
    "<PAYLOAD_FIELD_2>": "<VALUE>"
  }
}
```

**Legacy Request** (if applicable, via custom endpoint):
```json
{
  "<LEGACY_FIELD_1>": "<VALUE>",
  "<LEGACY_FIELD_2>": "<VALUE>"
}
```

### Response JSON Example

**Success Response**:
```json
{
  "success": true,
  "result": {
    "provider": "<PROVIDER_NAME>",
    "task": "<TASK_TYPE>",
    "success": true,
    "data": {
      "<RESULT_FIELD_1>": "<VALUE>",
      "<RESULT_FIELD_2>": "<VALUE>"
    }
  }
}
```

**Partial Success Response** (if applicable):
```json
{
  "success": true,
  "result": {
    "provider": "<PROVIDER_NAME>",
    "task": "<TASK_TYPE>",
    "success": true,
    "data": {
      "<RESULT_FIELD_1>": "<VALUE>",
      "<RESULT_FIELD_2>": null,
      "warnings": ["<WARNING_MESSAGE>"]
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
    "message": "<Specific validation error message>",
    "details": {
      "field": "<FIELD_NAME>",
      "reason": "<Why validation failed>"
    },
    "statusCode": 400
  }
}
```

**Error Example 2: Provider Error**
```json
{
  "success": false,
  "error": {
    "code": "<PROVIDER>_ERROR",
    "message": "<Provider-specific error message>",
    "details": {
      "originalError": "<Original error from provider>",
      "status": <HTTP_STATUS>
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
    "message": "<Task execution failure message>",
    "details": {
      "provider": "<PROVIDER_NAME>",
      "task": "<TASK_TYPE>",
      "originalError": "<ERROR_CODE>"
    },
    "statusCode": 500
  }
}
```

---

## AI Execution Rules

### Provider

**Primary Provider**: `<PROVIDER_NAME>` (e.g., `OPENAI`, `ANTHROPIC`, `GEMINI`)

**Fallback Providers** (if applicable):
- `<FALLBACK_PROVIDER_1>`: `<When used>`
- `<FALLBACK_PROVIDER_2>`: `<When used>`

**Provider Selection Logic**:
- `<Rule for selecting primary provider>`
- `<Rule for falling back to alternative providers>`

### Model Selection Rules

**Default Model**: `<MODEL_NAME>` (e.g., `gpt-4o-mini`, `claude-3-sonnet`)

**Model Selection Criteria**:
- `<Criterion 1>`: `<Which model is selected>`
- `<Criterion 2>`: `<Which model is selected>`

**Model Override** (if applicable):
- User can specify model: `<Yes/No>`
- Allowed models: `<List of allowed models>`

### Prompt Format Rules

**System Prompt Structure**:
```
<Structure of system prompt, including placeholders>
```

**User Prompt Structure**:
```
<Structure of user prompt, including placeholders>
```

**Prompt Assembly Rules**:
- `<Rule 1 for assembling prompts>`
- `<Rule 2 for assembling prompts>`
- `<Rule 3 for assembling prompts>`

**Prompt Examples**:
- Example 1: `<Example system prompt>`
- Example 2: `<Example user prompt>`

### System Prompts vs User Prompts

**System Prompt**:
- Purpose: `<What the system prompt defines>`
- Content: `<What goes in system prompt>`
- Static or Dynamic: `<Static/Dynamic>`

**User Prompt**:
- Purpose: `<What the user prompt contains>`
- Content: `<What goes in user prompt>`
- Source: `<Where user prompt comes from>`

### Token Limits (if applicable)

**Input Token Limits**:
- Maximum input tokens: `<NUMBER>`
- Recommended input tokens: `<NUMBER>`
- Truncation behavior: `<How input is truncated if exceeded>`

**Output Token Limits**:
- Maximum output tokens: `<NUMBER>`
- Default output tokens: `<NUMBER>`
- Truncation behavior: `<How output is truncated if exceeded>`

**Total Token Limits**:
- Maximum total tokens (input + output): `<NUMBER>`
- Model context window: `<NUMBER>`

### Timeout Behavior

**Provider Timeout**: `<TIMEOUT_SECONDS>` seconds

**Subprocess Timeout**: 60 seconds (Flask-level)

**Timeout Handling**:
- If provider timeout: `<What happens>`
- If subprocess timeout: `<What happens>`
- User experience: `<What user sees on timeout>`

### Retries Behavior

**Retry Strategy**: `<No retries / Exponential backoff / Fixed retries>`

**Retry Conditions**:
- `<Condition 1>`: `<Retry or fail immediately>`
- `<Condition 2>`: `<Retry or fail immediately>`

**Retry Limits**:
- Maximum retries: `<NUMBER>`
- Retry delay: `<DELAY_SECONDS>` seconds
- Backoff multiplier: `<MULTIPLIER>` (if exponential)

**Retry Error Codes**:
- Codes that trigger retry: `<LIST_OF_CODES>`
- Codes that fail immediately: `<LIST_OF_CODES>`

---

## Validation & Safety

### Input Validation Rules

**Required Field Validation**:
- `<FIELD_NAME>`: `<Validation rule>`
- `<FIELD_NAME>`: `<Validation rule>`

**Type Validation**:
- `<FIELD_NAME>`: Must be `<TYPE>`, reject if `<INVALID_TYPE>`
- `<FIELD_NAME>`: Must be `<TYPE>`, reject if `<INVALID_TYPE>`

**Range Validation**:
- `<FIELD_NAME>`: Must be between `<MIN>` and `<MAX>`
- `<FIELD_NAME>`: Must match pattern `<REGEX>`

**File Validation** (if applicable):
- File size: Maximum `<SIZE>` bytes
- File format: Allowed formats: `<LIST_OF_FORMATS>`
- File dimensions: `<DIMENSION_CONSTRAINTS>`
- File content: `<CONTENT_VALIDATION_RULES>`

**Cross-Field Validation**:
- `<Rule involving multiple fields>`
- `<Rule involving multiple fields>`

### Content Safety Constraints

**Input Content Safety**:
- Prohibited content: `<LIST_OF_PROHIBITED_CONTENT>`
- Content filtering: `<How content is filtered>`
- Moderation: `<Moderation approach>`

**Output Content Safety**:
- Output validation: `<How output is validated>`
- Safety checks: `<Safety checks performed>`
- Content warnings: `<When warnings are shown>`

**User Data Safety**:
- PII handling: `<How PII is handled>`
- Data retention: `<Data retention policy>`
- Privacy compliance: `<Privacy compliance measures>`

### Rate Limiting Assumptions

**Rate Limiting Strategy**:
- Per-user limits: `<LIMITS>`
- Per-IP limits: `<LIMITS>`
- Global limits: `<LIMITS>`

**Rate Limit Enforcement**:
- Where enforced: `<Flask / Node.js / Provider>`
- Error response: `<Error code and message>`
- Reset behavior: `<When limits reset>`

### Abuse Prevention Notes

**Abuse Vectors**:
- `<Abuse vector 1>`: `<Prevention measure>`
- `<Abuse vector 2>`: `<Prevention measure>`

**Detection Mechanisms**:
- `<Detection mechanism 1>`
- `<Detection mechanism 2>`

**Mitigation Actions**:
- `<Mitigation action 1>`
- `<Mitigation action 2>`

---

## Observability & Logging

### What Gets Logged

**Request Logging**:
- `<What request data is logged>`
- `<What request metadata is logged>`

**Execution Logging**:
- `<What execution data is logged>`
- `<What execution metadata is logged>`

**Response Logging**:
- `<What response data is logged>`
- `<What response metadata is logged>`

**Performance Logging**:
- `<What performance metrics are logged>`
- `<What timing data is logged>`

### What Must Never Be Logged

**Sensitive Data**:
- API keys: `<Never logged>`
- User passwords: `<Never logged>`
- PII: `<Never logged>`
- `<Other sensitive data>`: `<Never logged>`

**Logging Constraints**:
- `<Constraint 1>`
- `<Constraint 2>`

### Debug Flags and Safe Diagnostics

**Debug Mode**:
- Enable flag: `<ENVIRONMENT_VARIABLE>`
- Debug output: `<What debug output includes>`
- Debug location: `<Where debug output goes>`

**Safe Diagnostics**:
- Environment check: `<What environment info is safe to log>`
- Configuration check: `<What config info is safe to log>`
- Status check: `<What status info is safe to log>`

**Diagnostic Endpoints** (if applicable):
- `<ENDPOINT>`: `<What it returns>`
- `<ENDPOINT>`: `<What it returns>`

---

## Acceptance Criteria

### Definition of Done Checklist

**Functional Requirements**:
- [ ] All tools within service are implemented
- [ ] All inputs are validated
- [ ] All outputs match specification
- [ ] Error handling is complete
- [ ] User flow is end-to-end functional

**Technical Requirements**:
- [ ] API contracts are implemented
- [ ] AI execution rules are followed
- [ ] Validation and safety rules are enforced
- [ ] Observability is implemented
- [ ] Code follows architecture patterns

**Quality Requirements**:
- [ ] Tests are written and passing
- [ ] Documentation is complete
- [ ] Performance meets SLA
- [ ] Security review is complete
- [ ] Error messages are user-friendly

### Required Tests

**Unit Tests**:
- `<Test category 1>`: `<What is tested>`
- `<Test category 2>`: `<What is tested>`

**Integration Tests**:
- `<Test category 1>`: `<What is tested>`
- `<Test category 2>`: `<What is tested>`

**End-to-End Tests**:
- `<Test scenario 1>`: `<What is tested>`
- `<Test scenario 2>`: `<What is tested>`

**Error Case Tests**:
- `<Error scenario 1>`: `<What is tested>`
- `<Error scenario 2>`: `<What is tested>`

### Expected Performance (Basic SLA Statement)

**Response Time**:
- P50 (median): `<TIME>` seconds
- P95: `<TIME>` seconds
- P99: `<TIME>` seconds
- Maximum: `<TIME>` seconds

**Throughput**:
- Requests per second: `<NUMBER>`
- Concurrent requests: `<NUMBER>`

**Reliability**:
- Success rate: `<PERCENTAGE>%`
- Error rate: `<PERCENTAGE>%`
- Availability: `<PERCENTAGE>%`

**Resource Usage**:
- Memory: `<MEMORY_USAGE>`
- CPU: `<CPU_USAGE>`
- Network: `<NETWORK_USAGE>`

---

## Versioning

### Spec Version

**Current Version**: `<VERSION_NUMBER>` (e.g., `1.0.0`)

**Version Format**: `<MAJOR>.<MINOR>.<PATCH>`
- Major: Breaking changes
- Minor: Non-breaking feature additions
- Patch: Bug fixes and clarifications

### Change Log

**Version History**:
- `<VERSION>` - `<DATE>`: `<Description of changes>`
- `<VERSION>` - `<DATE>`: `<Description of changes>`

**Upcoming Changes**:
- `<Planned change 1>`
- `<Planned change 2>`

### Backward Compatibility Notes

**Compatibility Policy**:
- `<Compatibility rule 1>`
- `<Compatibility rule 2>`

**Breaking Changes**:
- `<Breaking change 1>`: `<Migration path>`
- `<Breaking change 2>`: `<Migration path>`

**Deprecation Notices**:
- `<Deprecated feature 1>`: `<Replacement and timeline>`
- `<Deprecated feature 2>`: `<Replacement and timeline>`

---

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [API Contracts](00-api-contracts.md)
- [Runtime Architecture](00-architecture-runtime.md)
