**Title**: Dashboard Architecture  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: UI, Dashboard

---

# Dashboard Architecture: FutureSelfApp

This document explains the conceptual architecture of the FutureSelfApp dashboard, including layout structure, navigation patterns, and workspace organization.

## Overview

The Future Self dashboard is the central workspace where authenticated users access all AI tools, view their work history, and manage their account. The dashboard is designed for efficiency, clarity, and focus on the user's primary task: generating AI content.

## Layout Structure

### Main Left Sidebar

**Purpose**: Primary navigation for accessing all services/tools and account features.

**Components**:
- **Services/Tools Navigation**: List of all available AI Services (displayed as "tools" in UI)
  - The Time Capsule
  - The Cinematic Switch
  - Global Voice
  - Instant Influencer
  - Viral Hook Gen
- **Account Navigation**: Links to account settings, credits, history, saved work, referrals
- **Quick Actions**: Credit balance display, account status

**Behavior**:
- **Collapsible**: Sidebar can be collapsed to show only icons
- **Icons Remain Visible**: When collapsed, tool icons remain visible for quick access
- **Persistent**: Sidebar remains visible across all dashboard pages
- **Active State**: Current tool/page is highlighted

**Visual Design**:
- Fixed position on the left side
- Smooth collapse/expand animation
- Icon + text labels (text hidden when collapsed)
- Clear visual hierarchy

### Tool-Specific Sidebar

**Purpose**: Contextual navigation and controls specific to the active tool.

**Components**:
- **Tool Functions**: Available actions and features for the current tool
- **Input Controls**: Form fields, selectors, and configuration options
- **Tool Settings**: Preferences and options specific to the tool
- **Quick Help**: Tool-specific tips or guidance (if applicable)

**Behavior**:
- **Contextual**: Only appears when a tool is active
- **Tool-Specific**: Content changes based on selected tool
- **Collapsible**: Can be hidden to maximize workspace area
- **Persistent During Tool Use**: Remains visible while working within a tool

**Examples by Tool**:
- **Time Capsule**: Image upload, dream input, generation button
- **Cinematic Switch**: Media upload, scene description, style options
- **Global Voice**: Video upload, language selector, script input
- **Instant Influencer**: Photo upload, style selector, generation options
- **Viral Hook Gen**: Description input, platform selector, tone options

### Main Workspace Area

**Purpose**: Primary area for user output, results display, and work history.

**Components**:
- **Results Display**: Shows generated AI outputs (images, videos, text)
- **Work History**: Previous generations from the current tool
- **Output Actions**: Download, save, share, regenerate options
- **Loading States**: Progress indicators during generation
- **Error Messages**: Clear error display if generation fails

**Behavior**:
- **Tool-Specific**: Content adapts to the active tool's output type
- **Scrollable**: Handles long content and history lists
- **Responsive**: Adapts to available space based on sidebar states
- **Focus Area**: Primary visual focus for user attention

**Content Types**:
- **Images**: Photo aging results, headshots, transformed images
- **Videos**: Translated videos, scene transformations
- **Text**: Wisdom letters, captions, hooks, hashtags
- **Mixed**: Combinations of media types when applicable

### No Right-Side Sidebar

**Design Decision**: The dashboard intentionally avoids a right-side sidebar to prevent clutter and maintain focus.

**Rationale**:
- **Reduced Cognitive Load**: Two sidebars can be overwhelming
- **Maximum Workspace**: More space for results and content
- **Cleaner Interface**: Simpler, more focused user experience
- **Mobile Friendly**: Easier to adapt to smaller screens

**Alternative Approaches**:
- Account information and quick actions integrated into main left sidebar
- Modal dialogs for account settings and billing
- Dropdown menus for additional options
- Top bar for account status and notifications (if needed)

## Navigation Flow

### Entry Point
1. User logs in → Redirected to Dashboard
2. Dashboard shows default view (tool selection or most recent tool)

### Tool Selection
1. User clicks tool in left sidebar
2. Tool-specific sidebar appears (if applicable)
3. Main workspace updates to show tool interface
4. Left sidebar remains visible (collapsed or expanded)

### Within Tool
1. User interacts with tool-specific sidebar (inputs, controls)
2. Generates content
3. Results appear in main workspace area
4. Previous work history visible below current results
5. User can save, download, or regenerate

### Account Management
1. User clicks account link in left sidebar
2. Main workspace updates to show account page
3. Tool-specific sidebar disappears
4. Account-specific content displayed

## Responsive Behavior

### Desktop (> 1024px)
- Full sidebar visible (can be collapsed)
- Tool-specific sidebar visible when tool is active
- Main workspace uses remaining space
- All features accessible

### Tablet (768px - 1024px)
- Left sidebar can be collapsed to icons
- Tool-specific sidebar may become collapsible
- Main workspace adapts to available space
- Touch-friendly interactions

### Mobile (< 768px)
- Left sidebar becomes hamburger menu or bottom navigation
- Tool-specific sidebar becomes modal or integrated into main area
- Main workspace full-width
- Simplified navigation patterns

## State Management

### Sidebar States
- **Expanded**: Full sidebar with text labels
- **Collapsed**: Icons only
- **Hidden**: Completely hidden (mobile, or user preference)

### Tool States
- **Tool Selection**: No tool active, showing tool grid or default view
- **Tool Active**: Specific tool loaded, tool-specific sidebar visible
- **Generating**: Loading state, progress indicators
- **Results Display**: Output shown, actions available

### Workspace States
- **Empty**: No content, showing tool interface
- **Loading**: Generation in progress
- **Results**: Output displayed
- **History**: Previous work visible
- **Error**: Error message displayed

## Visual Hierarchy

### Primary Focus
- **Main Workspace**: Highest visual priority
- **Active Tool**: Clearly highlighted in left sidebar
- **Current Results**: Prominently displayed

### Secondary Elements
- **Left Sidebar**: Visible but not dominant
- **Tool-Specific Sidebar**: Contextual, supports main workspace
- **Account Info**: Subtle, accessible but not distracting

### Tertiary Elements
- **Help Text**: Available but not intrusive
- **Notifications**: Non-blocking, dismissible
- **Status Indicators**: Subtle, informative

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [Dashboard UX Flow](08-dashboard-ux-flow.md)
- [Page Structure](02-page-structure.md)
