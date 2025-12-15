# Glossary & Canonical Naming: FutureSelfApp

**Title**: Glossary & Canonical Naming  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Docs, Platform

---

## Canonical Project Name

**Official Name**: **FutureSelfApp**

**Usage Rules**:
- Use "FutureSelfApp" in all technical documentation
- Use "FutureSelfApp" in code comments and system identifiers
- Use "FutureSelfApp" in API documentation and contracts

**Do Not Use**:
- ❌ "Future Self" (spaced version)
- ❌ "Future Self App" (spaced version)
- ❌ "FutureSelf app" (mixed case)
- ❌ "FutureSelf" (without "App")

**Exception**: User-facing marketing materials may use "Future Self" for branding purposes, but technical documentation must use "FutureSelfApp".

---

## Canonical System Categories

### AI Services (Official System Term)

**Definition**: AI Services are the top-level offerings in FutureSelfApp. Each AI Service provides one or more tools that users can access.

**System Usage**:
- Use "AI Services" in architecture documentation
- Use "AI Services" in API contracts
- Use "AI Services" in service specifications
- Use "AI Services" in system-level discussions

**Examples**:
- "The platform provides five AI Services"
- "Each AI Service has its own execution contract"
- "AI Services are implemented in `/src/ai_tools/toolkits/`"

### Tools (UX Term, Maps to AI Services)

**Definition**: Tools are user-facing functions within an AI Service. Users interact with "tools" in the UI, but the system internally treats them as part of AI Services.

**UX Usage**:
- Use "tools" in user-facing documentation
- Use "tools" in UI labels and navigation
- Use "tools" when describing user experience

**System Mapping**:
- UX "tools" map to system "AI Services"
- When documenting system architecture, use "AI Services"
- When documenting user experience, "tools" is acceptable

**Examples**:
- UX: "Users can access tools from the dashboard"
- System: "AI Services are registered in the tool registry"
- Mixed: "The Time Capsule tool is an AI Service that provides photo aging"

### Capabilities (Marketing Term Only)

**Definition**: "Capabilities" is a marketing term used to describe what users can do with FutureSelfApp. It is not used in system naming, code, or technical documentation.

**Usage**:
- ✅ Marketing materials may use "capabilities"
- ❌ Technical documentation must not use "capabilities" as a system term
- ❌ Code must not reference "capabilities"

---

## Core Definitions

### AI Service

**Definition**: A top-level offering in FutureSelfApp that provides AI-powered functionality to users. Each AI Service contains one or more tools.

**Characteristics**:
- Has a canonical service name
- Has a system identifier (lowercase with hyphens)
- Has a service specification document
- Implements tools via `/src/ai_tools/toolkits/`
- Follows the universal tool execution lifecycle

**Examples**:
- The Time Capsule (service name: "time-capsule")
- The Cinematic Switch (service name: "cinematic-switch")
- Global Voice (service name: "global-voice")

**System Location**: `/src/ai_tools/toolkits/<service-id>/`

### Tool

**Definition**: A function within an AI Service that performs a specific AI task. Tools are what users interact with in the UI.

**Characteristics**:
- Belongs to an AI Service
- Has inputs, outputs, and constraints
- Follows the tool execution lifecycle
- Consumes credits per execution
- Saves outputs to tool-specific memory

**Examples**:
- Photo aging tool (within The Time Capsule service)
- Wisdom letter generation tool (within The Time Capsule service)
- Scene transformation tool (within The Cinematic Switch service)

**System Location**: Implemented as handlers in `/src/ai_tools/toolkits/<service-id>/handler.js`

### Capability

**Definition**: Marketing term describing what users can accomplish with FutureSelfApp. Not a system term.

**Usage Restriction**: Do not use "capability" in:
- Technical documentation
- Code comments
- API documentation
- System architecture documentation
- Service specifications

**Acceptable Usage**: Marketing materials, user-facing help content, landing page copy.

---

## Naming Rules

### Do / Don't Examples

#### Project Name

**✅ DO**:
- "FutureSelfApp uses a hybrid backend architecture"
- "The FutureSelfApp platform provides AI Services"
- "FutureSelfApp documentation is organized in `/docs`"

**❌ DON'T**:
- "Future Self uses a hybrid backend architecture"
- "The Future Self App platform provides AI Services"
- "FutureSelf app documentation is organized in `/docs`"

#### System Categories

**✅ DO**:
- "FutureSelfApp provides five AI Services"
- "Each AI Service follows the universal execution lifecycle"
- "AI Services are registered in the tool registry"

**❌ DON'T**:
- "FutureSelfApp provides five AI tools" (when referring to system architecture)
- "Each AI tool follows the universal execution lifecycle" (use "AI Service")
- "AI tools are registered in the tool registry" (use "AI Services")

**✅ DO (UX Context)**:
- "Users can access tools from the dashboard"
- "The tool selection interface shows available tools"
- "Each tool has its own workspace"

**Note**: In UX context, "tools" is acceptable because it matches user-facing terminology.

#### Service vs Tool

**✅ DO**:
- "The Time Capsule is an AI Service"
- "The Time Capsule service provides photo aging and wisdom letter tools"
- "AI Services are implemented in `/src/ai_tools/toolkits/`"

**❌ DON'T**:
- "The Time Capsule is an AI tool" (when referring to the service)
- "AI tools are implemented in `/src/ai_tools/toolkits/`" (use "AI Services")

**✅ DO (When Tool is Correct)**:
- "The photo aging tool processes user images"
- "Each tool within a service has its own handler"
- "Tools consume credits per execution"

---

## Terminology Mapping

### User-Facing → System Terms

| User-Facing Term | System Term | Usage Context |
|------------------|-------------|---------------|
| "Tools" | "AI Services" | Architecture, contracts, specifications |
| "Tools" | "Tools" | UX documentation, UI labels |
| "Capabilities" | Not used | Marketing only, not in system |

### Documentation Context Rules

**Architecture Documentation**:
- Always use "AI Services"
- Never use "tools" when referring to system architecture
- Never use "capabilities"

**UX Documentation**:
- May use "tools" when describing user experience
- Must map to "AI Services" when discussing system implementation
- May use "capabilities" only in marketing context

**API Contracts**:
- Always use "AI Services"
- Request/response schemas reference "AI Services"
- Error messages may use "tools" for user-friendliness

**Service Specifications**:
- Service name is the AI Service name
- Tools within service are documented as "tools"
- System implementation references "AI Services"

---

## Quick Reference

### When to Use "FutureSelfApp"
- All technical documentation
- Code comments
- System identifiers
- API documentation
- Architecture documentation

### When to Use "AI Services"
- System architecture discussions
- API contracts
- Service specifications
- Runtime architecture
- Tool execution lifecycle

### When to Use "Tools"
- User-facing documentation
- UI labels and navigation
- UX flow documentation
- User help content
- When describing what users interact with

### When to Use "Capabilities"
- Marketing materials only
- Landing page copy
- User-facing marketing content
- Not in technical documentation

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Runtime Architecture](00-architecture-runtime.md)
- [API Contracts](00-api-contracts.md)
- [Cursor Playbook](00-cursor-playbook.md)
