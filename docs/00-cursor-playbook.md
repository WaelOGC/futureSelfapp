**Title**: Cursor Playbook  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Governance, Cursor AI

---

# Cursor Playbook: FutureSelfApp

## Document Purpose & Authority

### Why This Document Exists

This document enforces **deterministic behavior** from Cursor AI and prevents:
- Random edits without context
- Architectural drift from documented patterns
- Undocumented changes to contracts or schemas
- Breaking changes without proper versioning
- Scope violations and unintended file modifications

### Authority Statement

**This document is mandatory for every Cursor task.**

**Violation Consequences**: Any task that violates these rules is **invalidated** and must be corrected before acceptance.

**Governance Authority**: This playbook has governance authority over all Cursor tasks. No Cursor task may proceed without acknowledging and following these rules.

**Enforcement**: Tasks may explicitly reference this document to enforce compliance. Cursor must acknowledge this playbook before executing any task.

---

## Mandatory Reading Order

### Pre-Task Reading Sequence

Before executing **any** task, Cursor must read documents in this exact order:

#### Step 1: Documentation Index
**Document**: `docs/00-docs-index.md`

**Purpose**: Understand the documentation structure and identify which documents apply to the task.

**Required Actions**:
- Read the entire index
- Identify relevant documents for the task
- Note the documentation hierarchy and authority levels

#### Step 2: Runtime Architecture
**Document**: `docs/00-architecture-runtime.md`

**Purpose**: Understand how the system executes, how requests flow, and platform constraints.

**Required Actions**:
- Understand the Flask → Node.js → AI Providers architecture
- Understand environment variable propagation
- Understand subprocess execution rules
- Understand error handling contracts

#### Step 3: API Contracts
**Document**: `docs/00-api-contracts.md`

**Purpose**: Understand request/response schemas, validation rules, and error formats.

**Required Actions**:
- Understand standard request/response envelopes
- Understand error taxonomy and error codes
- Understand AI execution contracts
- Understand validation rules

#### Step 4: Service Specification (if applicable)
**Document**: Service-specific spec created from `docs/00-service-spec-template.md`

**Purpose**: Understand the specific service being worked on, its tools, contracts, and requirements.

**Required Actions**:
- Understand service identity and scope
- Understand user flow and tools
- Understand API contracts for the service
- Understand AI execution rules for the service

#### Step 5: This Playbook
**Document**: `docs/00-cursor-playbook.md`

**Purpose**: Understand task execution rules, scope control, and change management requirements.

**Required Actions**:
- Understand task classification
- Understand scope control rules
- Understand change management rules
- Understand output requirements

### Reading Verification

**Before proceeding with any task**, Cursor must confirm:
- [ ] Documentation index has been read
- [ ] Runtime architecture has been read
- [ ] API contracts have been read
- [ ] Service specification has been read (if applicable)
- [ ] This playbook has been read

**If any document is missing or unclear**, Cursor must request clarification before proceeding.

---

## Task Classification

### Task Types

Tasks are classified into the following categories. Each category has specific rules about what Cursor is allowed to do.

#### 1. Documentation Tasks

**Definition**: Tasks that modify or create documentation files only.

**Allowed Actions**:
- Create new documentation files
- Update existing documentation files
- Reorganize documentation structure
- Add examples, clarifications, or corrections

**Prohibited Actions**:
- Modify application code
- Modify configuration files
- Modify test files
- Change runtime behavior

**Scope**: Documentation files in `/docs` directory and root-level documentation files (README.md, PLAN.md, etc.)

#### 2. Backend Tasks

**Definition**: Tasks that modify Flask backend (`app.py`) or Node.js bridge code (`/src`).

**Allowed Actions**:
- Add new Flask routes
- Modify existing Flask routes
- Add new Node.js modules
- Modify existing Node.js modules
- Update error handling
- Update validation logic

**Prohibited Actions**:
- Modify frontend code (`/pages`, `/templates`)
- Change API contracts without updating `docs/00-api-contracts.md`
- Change runtime architecture without updating `docs/00-architecture-runtime.md`
- Remove error handling or validation
- Add `process.exit()` calls in Node.js bridges

**Scope**: `app.py`, `/src` directory, and related configuration files

**Required Updates**: Must update API contracts document if request/response structures change

#### 3. Frontend Tasks

**Definition**: Tasks that modify UI code (React components, Flask templates, static assets).

**Allowed Actions**:
- Create new React components
- Modify existing React components
- Update Flask templates
- Update CSS/styling
- Update client-side JavaScript

**Prohibited Actions**:
- Modify backend code (`app.py`, `/src`)
- Change API request/response structures without backend coordination
- Remove error handling UI
- Break responsive design

**Scope**: `/pages`, `/templates`, static assets, and client-side JavaScript

**Required Updates**: Must coordinate with backend if API contracts change

#### 4. AI Service Implementation Tasks

**Definition**: Tasks that implement new AI services or modify existing AI services.

**Allowed Actions**:
- Create new service specifications using `docs/00-service-spec-template.md`
- Implement service tools in `/src/ai_tools/toolkits/`
- Add new provider clients
- Update AI router logic

**Prohibited Actions**:
- Implement services without service specification
- Change AI execution contracts without updating documentation
- Bypass provider abstraction layer
- Expose provider names to users
- Remove error handling

**Scope**: Service-specific code in `/src/ai_tools/toolkits/`, provider clients, AI router

**Required Updates**: 
- Must create service specification before implementation
- Must update API contracts if payload structures change
- Must update runtime architecture if execution flow changes

#### 5. Refactor / Cleanup Tasks

**Definition**: Tasks that refactor code structure, clean up code, or improve code quality without changing functionality.

**Allowed Actions**:
- Refactor code structure
- Improve code readability
- Remove dead code
- Update code formatting
- Improve error messages

**Prohibited Actions**:
- Change functionality
- Remove error handling
- Change API contracts
- Change runtime behavior
- Break existing tests

**Scope**: Must be explicitly declared in task description

**Required Updates**: Must ensure no functional changes; tests must still pass

---

## Scope Control Rules

### File Scope Declaration

**Mandatory Requirement**: Every task must explicitly declare which files are in scope.

**Declaration Format**:
```
Scope: <list of files or directories>
```

**Examples**:
- `Scope: docs/00-api-contracts.md`
- `Scope: app.py, src/ai/orchestration/ai.router.js`
- `Scope: /pages/LandingPage directory`

### Scope Enforcement

**Rule 1: No Modifications Outside Scope**
- Cursor must **not** modify files outside the declared scope
- If a file needs modification but is not in scope, Cursor must request scope expansion
- Unexpected file modifications invalidate the task

**Rule 2: Explicit Diff Reporting**
- Cursor must explicitly report all files that will be modified
- Cursor must show diffs for all changes
- No silent or hidden modifications

**Rule 3: Scope Validation**
- Before making changes, Cursor must verify files are in scope
- If scope is unclear, Cursor must request clarification
- Scope violations must be reported immediately

### Scope Expansion

**When Scope Expansion is Needed**:
- A file not in scope needs modification to complete the task
- Dependencies require changes outside declared scope
- Error handling requires updates to multiple files

**Process for Scope Expansion**:
1. Cursor identifies files outside scope that need modification
2. Cursor requests scope expansion with justification
3. User approves or denies scope expansion
4. If approved, scope is updated and task proceeds

---

## Change Management Rules

### Documentation Update Requirements

**Mandatory Documentation Updates**: Cursor must update documentation when:

1. **API Contracts Change**:
   - New request/response fields added
   - Field types or validation rules change
   - New error codes added
   - Endpoints added or removed
   - **Required Update**: `docs/00-api-contracts.md`

2. **Runtime Architecture Change**:
   - Subprocess execution changes
   - Environment variable propagation changes
   - Error handling contracts change
   - Platform constraints change
   - **Required Update**: `docs/00-architecture-runtime.md`

3. **Service Specification Change**:
   - Service tools change
   - Service contracts change
   - Service execution rules change
   - **Required Update**: Service-specific specification document

4. **Documentation Index Change**:
   - New documentation files created
   - Documentation structure reorganized
   - Document purposes change
   - **Required Update**: `docs/00-docs-index.md`

### Breaking Changes

**Definition**: Changes that alter existing behavior, contracts, or interfaces in ways that break compatibility.

**Breaking Change Examples**:
- Removing required fields from requests
- Changing field types
- Removing endpoints
- Changing error response structures
- Changing timeout values

**Breaking Change Process**:
1. **Identify Breaking Change**: Cursor must explicitly identify if a change is breaking
2. **Document Breaking Change**: Update relevant documentation with breaking change notice
3. **Version Increment**: Increment version number in affected documents
4. **Migration Guide**: Provide migration guide if applicable
5. **User Notification**: Breaking changes must be clearly documented

### Versioning Expectations

**Document Versioning**:
- All documentation files must have version numbers
- Version format: `MAJOR.MINOR.PATCH`
- Breaking changes increment MAJOR version
- Non-breaking feature additions increment MINOR version
- Bug fixes and clarifications increment PATCH version

**Code Versioning**:
- Code changes that affect contracts must update document versions
- Code changes that are breaking must increment MAJOR version
- Code changes that are non-breaking may increment MINOR or PATCH version

---

## Error Handling & Safety Rules

### No Destructive Commands

**Prohibited Commands**:
- `rm -rf` or equivalent file deletion commands
- `git reset --hard` or equivalent destructive git commands
- Database drop/truncate commands
- System-level destructive operations

**Allowed Commissions**:
- File creation and modification
- Safe git operations (add, commit, status)
- Read-only operations
- Non-destructive testing commands

**Confirmation Requirement**: If a destructive operation is necessary, Cursor must:
1. Explicitly state what will be deleted
2. Request explicit user confirmation
3. Provide rollback instructions

### No process.exit() in Node Bridges

**Prohibited**: Cursor must **never** add `process.exit()` calls in Node.js bridge code.

**Required**: Use `process.exitCode` instead:
```javascript
// CORRECT
process.exitCode = 0;  // or 1 for error
await new Promise(r => setImmediate(r));  // Allow stdout to flush
return;

// FORBIDDEN
process.exit(0);  // Never do this
```

**Rationale**: `process.exit()` can terminate the process before stdout is flushed, breaking JSON output contracts.

**Enforcement**: Any code that adds `process.exit()` is invalid and must be corrected.

### JSON-Only Contracts Enforcement

**Rule**: All Node.js bridge output to stdout must be valid JSON only.

**Prohibited**:
- `console.log()` to stdout
- Debug output to stdout
- Progress indicators to stdout
- Any non-JSON text to stdout

**Required**:
- All output to `process.stdout` must be valid JSON
- All logging must go to `process.stderr`
- Use helper functions: `writeJson()` and `writeError()`

**Enforcement**: Code that outputs non-JSON to stdout is invalid.

### Deterministic Output Requirements

**Rule**: Same input must produce same output structure.

**Requirements**:
- Response structure must be consistent
- Error structure must be consistent
- Field names and types must match contracts
- No random or non-deterministic field names

**Enforcement**: Code that produces non-deterministic output structures is invalid.

---

## Output Requirements

### Mandatory Task Summary

Every Cursor task must end with a summary containing:

#### 1. Summary of Changes
**Format**: Brief description of what was changed and why.

**Example**:
```
Summary: Updated API contracts document to include new error code TIMEOUT.
Added timeout error example and updated error taxonomy section.
```

#### 2. Files Touched
**Format**: Explicit list of all files that were modified, created, or deleted.

**Example**:
```
Files Touched:
- docs/00-api-contracts.md (modified)
- docs/00-docs-index.md (modified)
```

#### 3. Risks (if any)
**Format**: Identification of any risks introduced by the changes.

**Example**:
```
Risks:
- None (documentation-only change)
```

**Or**:
```
Risks:
- Breaking change: Removed required field 'provider' from request schema
- Mitigation: Updated API contracts document with migration guide
```

#### 4. Next Recommended Step
**Format**: Suggestion for what should be done next.

**Example**:
```
Next Recommended Step:
- Review updated API contracts document
- Update frontend code to match new request schema
- Test API endpoint with new schema
```

### Output Format

**Required Structure**:
```
## Task Summary

### Changes Made
<Summary of changes>

### Files Modified
- <file1> (<action>: created/modified/deleted)
- <file2> (<action>: created/modified/deleted)

### Risks
<Risks identified, or "None">

### Next Steps
<Recommended next action>
```

---

## Enforcement Statement

### Cursor Acknowledgment Requirement

**Before executing any task**, Cursor must:

1. **Acknowledge this playbook has been read**
2. **Confirm understanding of task classification**
3. **Declare file scope explicitly**
4. **Confirm documentation update requirements are understood**
5. **Confirm safety rules are understood**

### Task Reference Authority

**Tasks may explicitly reference this document** to enforce compliance:

- Task descriptions may state: "Follow `docs/00-cursor-playbook.md`"
- Tasks may require specific playbook sections to be followed
- Violations of referenced playbook rules invalidate the task

### Compliance Verification

**After task completion**, verify:

- [ ] All mandatory reading was completed
- [ ] Task was correctly classified
- [ ] File scope was declared and respected
- [ ] Documentation was updated as required
- [ ] No destructive commands were used
- [ ] No `process.exit()` calls were added
- [ ] JSON-only contracts were enforced
- [ ] Task summary was provided

**If any verification fails**, the task is invalid and must be corrected.

### Violation Consequences

**Task Invalidation**: Tasks that violate playbook rules are invalidated and must be:
1. Corrected to comply with playbook rules
2. Re-executed with proper compliance
3. Verified for compliance before acceptance

**Repeated Violations**: If Cursor repeatedly violates playbook rules, tasks must be:
1. Explicitly reviewed for compliance
2. Corrected before any further work proceeds
3. Documented for pattern identification

---

## Quick Reference Checklist

### Before Starting Any Task

- [ ] Read `docs/00-docs-index.md`
- [ ] Read `docs/00-architecture-runtime.md`
- [ ] Read `docs/00-api-contracts.md`
- [ ] Read service specification (if applicable)
- [ ] Read this playbook
- [ ] Classify the task type
- [ ] Declare file scope
- [ ] Acknowledge playbook rules

### During Task Execution

- [ ] Stay within declared file scope
- [ ] Follow task type rules
- [ ] Enforce JSON-only contracts (if Node.js bridge)
- [ ] Never use `process.exit()`
- [ ] Never use destructive commands
- [ ] Update documentation as required
- [ ] Maintain deterministic output

### After Task Completion

- [ ] Provide task summary
- [ ] List all files touched
- [ ] Identify risks
- [ ] Suggest next steps
- [ ] Verify compliance with playbook

---

## Required Cursor Prompt Header (Copy/Paste)

**Use this header in every Cursor prompt to enforce compliance:**

```
MANDATORY READING (read in this order):
1. docs/00-cursor-playbook.md
2. docs/00-docs-index.md
3. docs/00-architecture-runtime.md
4. docs/00-api-contracts.md
5. docs/00-glossary.md
6. [Service specification if applicable]

SCOPE DECLARATION:
Files in scope: [list files/directories]
Files out of scope: [list files/directories if any]

OUTPUT REQUIREMENTS:
- Summary of changes
- Files touched (created/modified/deleted)
- Risks identified
- Next recommended step

NO CODE CHANGES unless explicitly allowed in task description.
```

**Usage Instructions**:
1. Copy the header block above
2. Paste at the beginning of every Cursor prompt
3. Fill in scope declaration with specific files
4. Cursor must acknowledge reading all mandatory documents
5. Cursor must declare scope before making changes

**Enforcement**: Tasks that do not include this header or violate its requirements are invalidated.

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [Runtime Architecture](00-architecture-runtime.md)
- [API Contracts](00-api-contracts.md)
