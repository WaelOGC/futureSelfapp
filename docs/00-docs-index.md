**Title**: Master Documentation Index  
**Status**: Active  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Docs

---

# Master Documentation Index: FutureSelfApp

## Document Purpose

This document is the **single source of truth** for all documentation in the Future Self App project. It serves as the mandatory navigation map for:

- **Cursor AI**: Must read this index before beginning any development task
- **Developers**: Reference guide for understanding documentation structure
- **Future Contributors**: Onboarding guide to project documentation

**Critical Rule**: No development task should begin without consulting this index to identify which documents apply to the task at hand.

**Cursor AI Rule**: Cursor must read `docs/00-cursor-playbook.md` before executing any task. The playbook defines mandatory reading order and execution rules.

---

## Documentation Hierarchy

### Foundational Documents
Documents that establish core concepts, project identity, and business model. These are essential reading for understanding what the project is and why it exists.

### Architectural Documents
Documents that define system structure, technical architecture, and implementation patterns. These govern how the system is built and how components interact.

### Service-Level Documents
Documents that define specific features, services, or subsystems. These describe what functionality exists and how it operates.

### UX / Business Level Documents
Documents that define user experience flows, design specifications, and business logic. These govern how users interact with the system and what they experience.

### Future / Planned Documents
Documents that describe planned features, roadmaps, and future development. These indicate what is coming but not yet implemented.

---

## Per-Document Mapping

| Document Title | File Path | Primary Responsibility | System Layer | Related Code Folders |
|----------------|-----------|------------------------|--------------|---------------------|
| **FOUNDATIONAL** |
| Glossary & Canonical Naming | `docs/00-glossary.md` | Canonical project name, system categories, terminology definitions, naming rules | Docs, Platform | N/A (reference) |
| Project Overview | `docs/01-project-overview.md` | Defines what FutureSelfApp is, target users, business model, and relationship to OGC NewFinity | All layers | N/A (conceptual) |
| README | `README.md` | Setup instructions, tech stack overview, basic usage guide | All layers | Root directory structure |
| **ARCHITECTURAL** |
| Cursor Playbook | `docs/00-cursor-playbook.md` | Mandatory rules for Cursor AI: reading order, task classification, scope control, change management, error handling, output requirements | Governance, Cursor AI | All Cursor tasks, all code changes |
| Runtime Architecture | `docs/00-architecture-runtime.md` | Official runtime architecture: Flask → Node.js → AI Providers execution flow, environment propagation, error handling, platform constraints | Runtime, Backend, Execution | `app.py`, `/src`, subprocess execution |
| API Contracts | `docs/00-api-contracts.md` | Official API contracts: request/response schemas, error taxonomy, validation rules, AI execution contracts | API, Backend, Frontend | All API endpoints, request/response handling |
| Service Specification Template | `docs/00-service-spec-template.md` | Reusable template for documenting AI services: service identity, user flow, tools, API contracts, AI execution rules, validation, observability | Services, Documentation | All AI services, service implementation |
| Dashboard Architecture | `docs/04-dashboard-architecture.md` | Layout structure, sidebar design, workspace organization, navigation patterns | UI, Dashboard | `/pages`, `/templates` |
| Tools System Architecture | `docs/09-tools-system-architecture.md` | Universal tool execution lifecycle, credit consumption logic, multi-provider abstraction, error handling | AI Services, Backend, Runtime | `/src/ai`, `/src/ai_tools`, `/src/ai/providers` |
| Architecture Refactor Summary | `ARCHITECTURE_REFACTOR_SUMMARY.md` | Documents completed refactoring from monolithic HTML to React component architecture | UI, Frontend | `/pages` |
| **SERVICE-LEVEL** |
| Page Structure | `docs/02-page-structure.md` | All planned pages, routes, navigation structure, access rules | UI, Routing | `/templates`, `/pages`, `app.py` routes |
| User Account System | `docs/03-user-account-system.md` | Account data structure, profile information, credits, subscriptions, memory, referrals | Accounts, Backend | Backend account models (when implemented) |
| Tools and Memory | `docs/05-tools-and-memory.md` | How tools work conceptually, memory system, previous outputs display | AI Services, Memory | `/src/ai_tools` |
| Credits and Subscriptions | `docs/07-credits-and-subscriptions.md` | Account types, credit system, subscription logic, usage limits, multi-AI provider strategy, referral program | Billing, Accounts, Credits | Backend billing logic (when implemented) |
| User Account Management | `docs/10-user-account-management.md` | Account area pages, profile management, security, usage tracking, saved work, referrals | Accounts, UI | Account management pages (when implemented) |
| Payments and Billing | `docs/11-payments-and-billing.md` | Payment methods, checkout flow, credit purchases, subscription billing, billing records | Billing, Payments | Payment processing logic (when implemented) |
| Services Catalog | `SERVICES.md` | Detailed specifications for all 5 AI services, target audiences, AI engines, technical implementation | AI Services, Backend | `/src/ai_tools/toolkits` |
| **UX / BUSINESS LEVEL** |
| Dashboard UX Flow | `docs/08-dashboard-ux-flow.md` | User navigation flows, tool selection, workspace states, memory access, credit visibility | UI, UX | `/pages`, dashboard components |
| Support and Help | `docs/06-support-and-help.md` | Support button behavior, help center structure, FAQs, contact support | UI, Support | Support pages (when implemented) |
| Landing Page Design | `LANDING_PAGE_DESIGN.md` | Complete design specification for landing page: sections, visual system, typography, spacing, responsive behavior | UI, Design | `/pages/LandingPage` |
| **FUTURE / PLANNED** |
| Technical Roadmap | `PLAN.md` | Development phases, implementation priorities, API integration plans, future enhancements | All layers | N/A (planning document) |

---

## Runtime Authority Section

### Hybrid Backend Architecture

This project uses a **hybrid backend architecture**:

```
UI → Flask (Python) → Node.js Bridge → AI Providers
```

**Architecture Breakdown**:

1. **UI Layer**: 
   - Flask templates (`/templates`) for server-rendered pages
   - React components (`/pages`) for section-based page architecture
   - Static assets and client-side JavaScript

2. **Flask Backend** (`app.py`):
   - HTTP routing and request handling
   - Template rendering
   - Initial request processing
   - File upload handling

3. **Node.js Bridge** (`/src`):
   - AI orchestration (`/src/ai/orchestration`)
   - Provider abstraction (`/src/ai/providers`)
   - Tool registry and execution (`/src/ai_tools`)
   - API controllers and routes (`/src/api`)

4. **AI Providers**:
   - Multiple provider support (OpenAI, Anthropic, Gemini, Replicate)
   - Provider abstraction layer
   - Dynamic routing and fallback logic

### Documentation Authority Hierarchy

**Highest Authority** (Runtime Behavior):
- `docs/00-architecture-runtime.md` - Defines official runtime architecture, execution flow, environment propagation, error handling contracts
- `docs/00-api-contracts.md` - Defines official API contracts, request/response schemas, error taxonomy, validation rules
- `docs/09-tools-system-architecture.md` - Defines how AI Services execute, credit consumption, error handling
- `docs/11-payments-and-billing.md` - Defines payment processing and billing logic
- `docs/07-credits-and-subscriptions.md` - Defines credit system and subscription behavior

**High Authority** (System Architecture):
- `docs/04-dashboard-architecture.md` - Defines dashboard structure and layout
- `ARCHITECTURE_REFACTOR_SUMMARY.md` - Documents current frontend architecture

**Medium Authority** (Feature Specifications):
- `docs/02-page-structure.md` - Defines page routes and structure
- `docs/03-user-account-system.md` - Defines account data structure
- `docs/05-tools-and-memory.md` - Defines tool concepts and memory system
- `SERVICES.md` - Defines service specifications

**Lower Authority** (UX and Design):
- `docs/08-dashboard-ux-flow.md` - Defines user experience flows
- `docs/06-support-and-help.md` - Defines support system UX
- `LANDING_PAGE_DESIGN.md` - Defines landing page design specification

**Planning Documents** (Reference Only):
- `PLAN.md` - Future development plans
- `README.md` - Setup and basic information

**Rule**: When documentation conflicts occur, higher authority documents take precedence. Runtime behavior documentation has the highest authority for implementation decisions.

---

## Cursor Mandatory Reading Rules

### Rule 1: Read Cursor Playbook First
Before beginning any development task, Cursor must:
1. Read the Cursor Playbook (`docs/00-cursor-playbook.md`)
2. Read the Glossary (`docs/00-glossary.md`) for canonical naming
3. Follow the mandatory reading order defined in the playbook
4. Acknowledge understanding of playbook rules
5. Proceed with task execution according to playbook guidelines

### Rule 2: Read This Index Second
After reading the playbook, Cursor must:
1. Read this index document (`docs/00-docs-index.md`)
2. Identify which documents apply to the task
3. Read all applicable documents before making code changes
4. Understand the documentation hierarchy and authority

### Rule 3: Identify Applicable Documents
For each task, Cursor must:
1. Determine which system layer is affected (UI, Backend, AI Services, Billing, Accounts, etc.)
2. Consult the "Per-Document Mapping" table to find relevant documents
3. Read documents in order of authority (highest authority first)
4. Cross-reference related documents when needed

### Rule 4: Scope Definition
Cursor must not modify files outside the scope defined by the mapped documents:
1. If a task affects AI Services, read `docs/09-tools-system-architecture.md` first
2. If a task affects billing, read `docs/11-payments-and-billing.md` first
3. If a task affects UI, read relevant UX/design documents
4. Only modify code that is explicitly within the documented scope

### Rule 5: Documentation Updates
If code changes alter documented behavior, Cursor must:
1. Identify which documentation files are affected
2. Update the relevant documentation to reflect new behavior
3. Maintain consistency across all documentation
4. Update this index if new documents are created or document purposes change

### Rule 6: Architecture Compliance
Cursor must ensure all changes comply with:
1. Runtime architecture (Flask → Node.js → AI Providers)
2. Tool execution lifecycle (as defined in `docs/09-tools-system-architecture.md`)
3. Credit consumption logic (as defined in `docs/07-credits-and-subscriptions.md`)
4. Dashboard structure (as defined in `docs/04-dashboard-architecture.md`)
5. Page structure and routing (as defined in `docs/02-page-structure.md`)

### Rule 7: No Inferred Features
Cursor must not:
1. Implement features not documented in the documentation
2. Add functionality that conflicts with documented architecture
3. Modify system behavior without updating documentation
4. Create new patterns that deviate from documented standards

### Rule 8: Error Handling Compliance
All error handling must follow patterns defined in:
1. `docs/09-tools-system-architecture.md` - Tool error handling
2. `docs/11-payments-and-billing.md` - Payment error handling
3. Calm, non-intrusive error UX principles

### Rule 9: Multi-Provider Abstraction
When working with AI providers, Cursor must:
1. Use the provider abstraction layer (`/src/ai/providers`)
2. Never expose provider names to users (as per `docs/07-credits-and-subscriptions.md`)
3. Follow multi-provider routing logic (as per `docs/09-tools-system-architecture.md`)
4. Maintain provider independence

---

## Document Maintenance

### When to Update This Index

This index must be updated when:
1. New documentation files are created
2. Existing documentation files are significantly restructured
3. Document purposes or responsibilities change
4. New system layers or components are added
5. Documentation hierarchy changes

### Index Update Process

1. Identify the change (new document, restructured document, etc.)
2. Determine the appropriate hierarchy level (Foundational, Architectural, Service-Level, UX/Business, Future/Planned)
3. Add or update the entry in the "Per-Document Mapping" table
4. Update relevant sections if system layers or architecture change
5. Maintain consistency with existing index structure

---

## Quick Reference: Document by Task Type

### Working on Runtime/Backend
**Read First**: `docs/00-architecture-runtime.md`, `docs/00-api-contracts.md`  
**Also Read**: `docs/09-tools-system-architecture.md`

### Working on API Endpoints
**Read First**: `docs/00-api-contracts.md`  
**Also Read**: `docs/00-architecture-runtime.md`

### Working on AI Tools
**Read First**: `docs/00-architecture-runtime.md`, `docs/09-tools-system-architecture.md`  
**Also Read**: `docs/05-tools-and-memory.md`, `SERVICES.md`, `docs/07-credits-and-subscriptions.md`

### Documenting New AI Services
**Read First**: `docs/00-service-spec-template.md`  
**Also Read**: `docs/00-api-contracts.md`, `docs/00-architecture-runtime.md`, `SERVICES.md`

### Working on Dashboard UI
**Read First**: `docs/04-dashboard-architecture.md`  
**Also Read**: `docs/08-dashboard-ux-flow.md`, `docs/02-page-structure.md`, `ARCHITECTURE_REFACTOR_SUMMARY.md`

### Working on User Accounts
**Read First**: `docs/03-user-account-system.md`  
**Also Read**: `docs/10-user-account-management.md`, `docs/07-credits-and-subscriptions.md`

### Working on Billing/Payments
**Read First**: `docs/11-payments-and-billing.md`  
**Also Read**: `docs/07-credits-and-subscriptions.md`

### Working on Landing Page
**Read First**: `LANDING_PAGE_DESIGN.md`  
**Also Read**: `docs/02-page-structure.md`, `ARCHITECTURE_REFACTOR_SUMMARY.md`

### Working on Support System
**Read First**: `docs/06-support-and-help.md`  
**Also Read**: `docs/02-page-structure.md`

### Planning New Features
**Read First**: `PLAN.md`  
**Also Read**: `docs/01-project-overview.md`, `SERVICES.md`, relevant architectural documents

### Understanding Project Structure
**Read First**: `docs/01-project-overview.md`  
**Also Read**: `README.md`, `docs/02-page-structure.md`, `docs/00-glossary.md`

---

---

**See also**:
- [Glossary & Canonical Naming](00-glossary.md)
- [Cursor Playbook](00-cursor-playbook.md)
- [Runtime Architecture](00-architecture-runtime.md)
- [API Contracts](00-api-contracts.md)
