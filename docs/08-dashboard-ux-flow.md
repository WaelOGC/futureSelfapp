**Title**: Dashboard UX Flow and Navigation Logic  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: UI, UX

---

# Dashboard UX Flow and Navigation Logic: FutureSelfApp

This document defines how users move through the dashboard, access AI Services, view their work, manage their account, and interact with the platform. This is a UX flow and navigation logic document, not a visual design specification.

## Dashboard Entry Points

### After Login

**Flow**:
1. User enters credentials and submits login form
2. System authenticates user
3. User is redirected to dashboard
4. Dashboard loads with default landing state

**State on Arrival**:
- User is authenticated and session is active
- Dashboard shows default view (see Default Landing State)
- Main sidebar is visible (expanded or collapsed based on user preference)
- Credit balance is displayed
- User can immediately begin using tools

### After Signup

**Flow**:
1. User completes registration form (email, password, verification if required)
2. Account is created in system
3. Welcome credits may be awarded (if applicable)
4. User is automatically logged in
5. User is redirected to dashboard

**State on Arrival**:
- New account is active
- Dashboard shows default landing state
- Welcome message or onboarding may appear (if implemented)
- Credit balance shows initial credits (if any)
- User can begin using tools immediately

**First-Time User Experience**:
- Dashboard may highlight key features or tools
- Tool selection may be encouraged
- Help or tutorial may be offered (non-intrusive)
- User can dismiss onboarding and proceed

### From Landing Page CTA

**Flow**:
1. User clicks "Get Started" or similar CTA on landing page
2. If not logged in: Redirected to login/signup
3. If logged in: Redirected directly to dashboard
4. Dashboard loads with default landing state

**State on Arrival**:
- Same as After Login or After Signup (depending on authentication status)
- User intent is to start using tools
- Dashboard should facilitate immediate tool access

### Default Landing State

**What User Sees First**:

**Option 1: Tool Selection View** (Recommended for new users):
- Main workspace shows grid or list of available tools
- Each tool displays: name, brief description, status (active/coming soon)
- User can click any tool to begin
- Recent work may be shown below tool selection (if user has history)

**Option 2: Most Recent Tool** (Recommended for returning users):
- Dashboard opens to the last tool the user was using
- Tool-specific sidebar appears with previous inputs (if saved)
- Previous outputs from that tool visible below
- User can continue where they left off

**Logic for Default State**:
- **New Users** (no generation history): Show tool selection view
- **Returning Users** (has history): Show most recent tool
- **User Preference**: Allow users to set default landing preference (if implemented)

**Main Sidebar State**:
- Always visible (expanded or collapsed based on user preference)
- "Dashboard" or "Home" item is active/highlighted
- All navigation items are accessible

## Main Sidebar (Primary Navigation)

### Purpose

The main left sidebar is the primary navigation system for the entire dashboard. It provides persistent access to all major sections of the platform, ensuring users can always navigate to any area without losing context.

### Sidebar Contents

**Top Section - Core Navigation**:
- **Dashboard Home**: Returns to default landing state
- **Tools Section**: Expandable/collapsible group containing:
  - The Time Capsule
  - The Cinematic Switch
  - Global Voice
  - Instant Influencer
  - Viral Hook Gen
- **History**: Access to all past generations across all tools
- **Saved Work**: Access to user's saved and organized content

**Middle Section - Account & Resources**:
- **Credits & Billing**: Credit balance, purchase, subscription management
- **Account Settings**: Profile, security, preferences
- **Invite / Referrals**: Referral program access

**Bottom Section - Support & External**:
- **Support / Help**: Access to help center and support
- **Blog**: Link to blog (opens in new tab or same tab, depending on implementation)

**Status Display** (if shown in sidebar):
- Credit balance (always visible)
- Subscription status (if subscribed)
- Account type indicator (if applicable)

### Collapsible Behavior

**Expanded State**:
- Full sidebar width
- Icons + text labels visible
- All navigation items clearly labeled
- Maximum clarity and discoverability

**Collapsed State**:
- Reduced sidebar width (icons only)
- Text labels hidden
- Icons remain fully visible
- Tooltips appear on hover (showing full label)
- Space efficiency while maintaining navigation

**Collapse/Expand Trigger**:
- Toggle button at top or bottom of sidebar
- User preference is saved (remembers last state)
- Can be toggled at any time
- Smooth transition animation

### Why Sidebar Never Fully Disappears

**Rationale**:
- **Always Accessible**: Users can always navigate without searching for menu
- **Context Preservation**: Current location always visible (active state)
- **Efficiency**: No need to open/close menu repeatedly
- **Consistency**: Predictable navigation location
- **Mobile Exception**: On mobile, sidebar may become hamburger menu (see Responsive Behavior)

**Minimum Visibility**:
- Even when collapsed, icons remain visible
- Active tool/page is always indicated
- Credit balance remains visible (if displayed in sidebar)
- No hidden navigation that requires discovery

## Tool Navigation Flow

### Selecting a Tool

**Flow**:
1. User clicks tool name/icon in main sidebar
2. System loads tool interface
3. Dashboard context changes to tool-specific view
4. Tool-specific sidebar appears (if applicable)
5. Main workspace updates to show tool interface

**What Happens**:
- Main sidebar remains visible (tool item becomes active/highlighted)
- URL updates to tool-specific route (e.g., `/dashboard/time-capsule`)
- Tool-specific sidebar appears (replaces or supplements main sidebar)
- Main workspace clears previous tool content and shows new tool interface
- Previous work from this tool appears below (if any exists)

**State Changes**:
- Active tool is highlighted in main sidebar
- Tool-specific controls and inputs become available
- Workspace adapts to tool's output type
- History section updates to show this tool's previous outputs

### Dashboard Context Per Tool

**Context Switching**:
- Each tool has its own context and state
- Switching tools preserves work from previous tool (saved automatically)
- User can return to previous tool and find work intact
- No data loss when switching between tools

**Tool-Specific Features**:
- Each tool may have unique input methods
- Each tool may have unique output formats
- Each tool may have unique options or settings
- Context adapts to tool requirements

**Preservation Logic**:
- Inputs are auto-saved as user types/selects (if implemented)
- Generated outputs are automatically saved to tool memory
- User can return to any tool and see previous work
- Work is organized by tool (per-tool memory system)

### Switching Tools

**Flow**:
1. User clicks different tool in main sidebar
2. Current tool's state is saved (inputs, if any)
3. New tool loads
4. Previous tool's work remains accessible (via history or returning to that tool)

**Preservation**:
- All generated outputs are saved automatically (no manual save required)
- Inputs may be preserved (if user was in middle of entering data)
- User can return to previous tool and continue
- No work is lost when switching

**Efficiency**:
- Switching is instant (no loading delay if possible)
- Context switches smoothly
- User can work across multiple tools in same session
- Each tool maintains its own independent state

## Tool-Specific Sidebar (Secondary Layer)

### Purpose

The tool-specific sidebar provides contextual controls, inputs, and options that are specific to the active tool. It appears only when a tool is selected and disappears when user navigates away from tools.

### Contents

**Input Controls**:
- File upload interfaces (images, videos)
- Text input fields (descriptions, prompts, scripts)
- Selection dropdowns (languages, styles, platforms)
- Configuration options (quality, format, parameters)

**Tool Actions**:
- Generate button (primary action)
- Reset/Clear button (if applicable)
- Save draft button (if applicable)
- Advanced options toggle (if applicable)

**Tool Settings**:
- Tool-specific preferences
- Default options
- Quality or style presets
- Output format selections

**Quick Help** (if implemented):
- Tool-specific tips
- Example inputs
- Best practices
- Link to full tool guide

### When It Appears and Disappears

**Appearance**:
- Appears automatically when tool is selected
- Slides in or fades in smoothly
- Positioned adjacent to main sidebar or as overlay
- Does not replace main sidebar (layered approach)

**Disappearance**:
- Disappears when user navigates away from tool
- Disappears when user selects "Dashboard Home"
- Disappears when user navigates to account pages
- Smooth transition out

**Persistence During Tool Use**:
- Remains visible while working within tool
- Can be collapsed/hidden to maximize workspace (if implemented)
- Reappears when expanded
- State is preserved (inputs remain if user collapses and reopens)

### Relationship to Main Sidebar

**Layered, Not Duplicated**:
- Tool-specific sidebar is a secondary layer
- Main sidebar remains visible behind or adjacent
- Two sidebars work together, not in competition
- Clear visual or spatial separation

**Complementary Functions**:
- Main sidebar: Navigation between tools and sections
- Tool-specific sidebar: Inputs and controls for active tool
- Both serve different purposes
- Both accessible simultaneously

**Space Management**:
- Tool-specific sidebar may push main workspace
- Or: Tool-specific sidebar overlays main workspace
- Or: Tool-specific sidebar replaces part of main sidebar temporarily
- Layout adapts to accommodate both

## Main Workspace Area

### Purpose

The main workspace area is the primary focus zone where users see outputs, interact with results, and view their work history. It is the central area of attention and action.

### Output Display

**Current Generation Results**:
- Results appear in main workspace after generation completes
- Output format adapts to tool type (image, video, text, mixed)
- Results are prominently displayed (primary visual focus)
- Clear separation between current results and history

**Output Actions**:
- Download button (for images, videos, files)
- Copy button (for text outputs)
- Save button (if not auto-saved, or for favorites)
- Share button (if implemented)
- Regenerate button (create new generation with same or modified inputs)

**Loading States**:
- Progress indicator during generation
- Estimated time remaining (if available)
- Cannot initiate new generation while one is in progress
- Clear feedback that processing is happening

**Error States**:
- Clear error message if generation fails
- Explanation of what went wrong
- Suggested actions (check inputs, try again, contact support)
- Credits are not consumed for clear system errors (per credits logic)

### Previous Results Display

**History Per Tool**:
- Previous outputs from current tool appear below current results
- Organized chronologically (newest first or oldest first, user preference)
- Scrollable list or grid layout
- Limited to recent items (e.g., last 10-20) with "View All" link

**Display Format**:
- **Images**: Thumbnail previews, click to view full size
- **Videos**: Thumbnail with play button, click to play
- **Text**: Preview with truncation, click to expand
- **Metadata**: Date, time, credits consumed (subtle, not prominent)

**Interaction with Past Outputs**:
- Click to view full output
- Download previous outputs
- Delete previous outputs (with confirmation)
- Reuse: Click to load previous inputs and regenerate
- Reference: View while creating new content (side-by-side if space allows)

### Workspace States

**Empty State** (No tool selected):
- Shows tool selection view or welcome message
- Encourages user to select a tool
- May show recent work summary (if user has history)

**Tool Active State** (Tool selected, no generation yet):
- Shows tool interface with inputs
- Tool-specific sidebar visible
- Ready for user input
- Previous work from this tool visible below (if any)

**Generating State** (Generation in progress):
- Loading indicator prominent
- Inputs may be disabled or shown as "processing"
- Cannot start new generation
- Previous work remains visible below

**Results State** (Generation complete):
- Current results prominently displayed
- Actions available (download, save, regenerate)
- Previous work visible below current results
- User can generate again or switch tools

**Error State** (Generation failed):
- Error message clearly displayed
- Suggested actions provided
- User can retry or modify inputs
- Previous work remains accessible

## Memory & History Flow

### Automatic Saving

**When Content is Saved**:
- All generated outputs are automatically saved immediately upon completion
- No manual save action required
- Saving happens in background (user doesn't wait)
- User can continue working immediately

**What is Saved**:
- Generated outputs (images, videos, text)
- Inputs used for generation (if applicable)
- Generation parameters and settings
- Timestamp and metadata
- Tool used and credits consumed

**User Control**:
- Users can delete saved work if desired
- Users can organize saved work (if collections/folders implemented)
- Users cannot disable automatic saving (ensures no work is lost)

### Content Grouping

**By Tool**:
- Primary organization method
- All content from Time Capsule grouped together
- All content from Cinematic Switch grouped together
- Each tool has its own isolated memory
- Clear separation between tools

**By Category** (if implemented):
- Users can create custom categories or folders
- Content can be tagged or labeled
- Organization is optional (not required)
- Default organization remains by tool

**By Date**:
- Chronological ordering within each tool
- Recent work appears first (or user preference)
- Date filters available in history view
- Easy to find work from specific time period

**By Status**:
- Recent (last 30 days)
- Favorites (user-marked)
- Archived (older content)
- Deleted (soft-deleted, recoverable for limited time)

### Finding Previous Work

**Within Tool View**:
- Previous outputs appear below current generation area
- Scrollable list shows recent work
- Click to view full output
- Quick access without leaving tool

**History Page**:
- Comprehensive view of all generations across all tools
- Filterable by tool, date, type
- Searchable (if implemented)
- Batch actions (delete, download, organize)

**Saved Work Page**:
- Organized collection of user's saved outputs
- Tool-specific sections
- User-created collections (if implemented)
- Quick access to favorites

**Search Functionality** (if implemented):
- Search across all saved work
- Search by tool, date, content type
- Search by input text or description
- Results show context and preview

**No Endless Scrolling**:
- History is paginated or limited to recent items
- "View All" or "Load More" for complete history
- Efficient loading and navigation
- No performance degradation with large history

## Credits & Status Visibility

### Credit Balance Display

**Location During Work**:
- Always visible in main sidebar (if displayed there)
- Or: Always visible in top bar or header
- Or: Visible in tool-specific sidebar
- Never hidden during active tool use

**Display Format**:
- Large, clear number
- "X credits" or "X credits available"
- Updates in real-time after purchases or usage
- No animation or distraction (calm, informative)

**Context During Generation**:
- Credit cost shown before generation ("This will use X credits")
- Balance check before processing
- Confirmation if balance is low
- Clear messaging if insufficient credits

### Usage Feedback

**Calm, Non-Intrusive Approach**:
- Credits consumed shown subtly after generation
- "X credits used" message (non-blocking, dismissible)
- Or: Shown in credit history, not as popup
- No aggressive notifications or pressure

**During Generation**:
- Credit cost displayed before user confirms
- Balance visible but not emphasized
- Focus remains on tool and output
- Credits are functional, not promotional

**After Generation**:
- Credits deducted automatically
- Balance updates quietly
- User can see deduction in credit history
- No interruption to workflow

### Low or Exhausted Credits

**Low Credit Warning**:
- Notification when balance falls below threshold (e.g., 10 credits)
- Shown as subtle indicator, not blocking alert
- Message: "Low credits - X remaining"
- Link to purchase credits (non-intrusive)

**Insufficient Credits**:
- Clear message when attempting generation without enough credits
- "Insufficient credits - You need X credits, you have Y"
- Prominent "Buy Credits" or "Subscribe" button
- No confusing error messages

**Zero Credits State**:
- All tools show "Insufficient credits" state
- Clear call-to-action to purchase credits
- Credit purchase flow easily accessible
- User can still view history and saved work

**Credit Purchase Flow**:
- Accessible from multiple locations (sidebar, low credit warning, insufficient credit message)
- Modal or dedicated page for credit purchase
- Clear package options and pricing
- Immediate credit addition after purchase
- Return to tool or continue workflow seamlessly

## Global Utility Elements

### Support Button Behavior

**Always Accessible**:
- Fixed position button, bottom-right corner
- Visible on all dashboard pages
- Never hidden or obscured
- Accessible during tool use, account management, history viewing

**Non-Intrusive**:
- Does not block content
- Does not interfere with tool inputs or outputs
- Can be clicked without disrupting workflow
- Opens support interface (modal, sidebar, or new page)

**Functionality**:
- Click opens support/help interface
- Provides access to help center, FAQs, contact form
- Tool-specific help available when tool is active
- Can be dismissed and reopened as needed

**Accessibility**:
- Keyboard accessible
- Screen reader friendly
- Clear focus states
- Always available for assistance

### Scroll-to-Top Button

**Behavior**:
- Appears after user scrolls down significant distance (e.g., 300-500px)
- Fixed position, bottom-right area
- Positioned to never overlap with support button
- Smooth fade-in/fade-out animation

**Positioning**:
- Above support button (stacked vertically)
- Or: Side-by-side with support button (if space allows)
- Minimum 16-24px gap between buttons
- Support button takes precedence if space is limited

**Functionality**:
- Click smoothly scrolls to top of page
- Instant scroll or animated scroll (user preference or system default)
- Hides when near top of page
- Non-intrusive, helpful utility

**Mobile Considerations**:
- May stack vertically on mobile
- May adjust position to avoid overlap
- Touch-friendly size
- Same functionality across devices

### Notifications (Conceptual)

**Purpose**: Inform users of important events without disrupting workflow.

**Notification Types** (Conceptual):
- Credit balance updates (subtle, non-blocking)
- Generation complete (if user navigated away)
- Subscription status changes
- Referral rewards earned
- System announcements (if any)

**Display Method** (Conceptual):
- Non-blocking toast notifications (dismissible)
- Or: Notification center/bell icon
- Or: Subtle indicators in relevant areas
- No aggressive popups or modals

**User Control**:
- Users can dismiss notifications
- Notification preferences in account settings
- Can disable certain notification types
- History of recent notifications (if implemented)

**Principles**:
- Calm, non-intrusive
- Informative, not promotional
- Actionable when appropriate
- Respect user's focus and workflow

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [Dashboard Architecture](04-dashboard-architecture.md)
- [Page Structure](02-page-structure.md)
