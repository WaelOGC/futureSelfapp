**Title**: Support and Help  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: UI, Support

---

# Support and Help: FutureSelfApp

This document describes the support system, help resources, and user assistance features available in FutureSelfApp.

## Support Floating Button

### Purpose
The support floating button provides users with quick, always-accessible access to help and support resources without leaving their current page or interrupting their workflow.

### Design and Behavior

**Visual Design**:
- Fixed position button, typically bottom-right corner
- Prominent but non-intrusive styling
- Icon-based (question mark, chat bubble, or support symbol)
- Hover state for visibility
- Accessible size for easy clicking

**Positioning**:
- **Fixed Position**: Remains visible during page scroll
- **Bottom-Right**: Standard placement for support widgets
- **Z-Index**: High enough to appear above page content but below modals
- **Responsive**: Adjusts position on mobile devices if needed

**Functionality**:
- Click opens support interface (modal, sidebar, or new page)
- Provides access to:
  - Help Center search
  - FAQs
  - Contact support form
  - Live chat (if implemented)
  - Tool-specific help

**Accessibility**:
- Keyboard accessible
- Screen reader friendly
- Clear focus states
- ARIA labels for assistive technologies

## Scroll-to-Top Button

### Purpose
The scroll-to-top button allows users to quickly return to the top of long pages without manual scrolling.

### Design and Behavior

**Visual Design**:
- Fixed position button
- Arrow or chevron-up icon
- Subtle styling that doesn't compete with support button
- Appears after user scrolls down a certain distance
- Smooth fade-in/fade-out animation

**Positioning**:
- **Fixed Position**: Remains visible during scroll
- **Bottom-Right**: Positioned to avoid overlap with support button
- **Spacing**: Sufficient gap between scroll-to-top and support buttons
- **Stacking**: Scroll-to-top above support button, or side-by-side if space allows

**Non-Overlap Requirement**:
- **Critical**: Must never overlap with support floating button
- **Spacing**: Minimum 16-24px gap between buttons
- **Mobile**: May stack vertically or adjust positions on small screens
- **Priority**: Support button takes precedence if space is limited

**Functionality**:
- Smooth scroll animation to top of page
- Appears after scrolling down ~300-500px
- Hides when near top of page
- Instant or animated scroll behavior

## Help Center

### Purpose
The Help Center is a comprehensive knowledge base providing self-service support resources for all FutureSelfApp features and AI Services.

### Structure

**Main Sections**:
- **Getting Started**: Introduction to Future Self, account setup, first steps
- **Tool Guides**: Detailed guides for each AI Service (displayed as "tools" in UI)
- **Account & Billing**: Credits, subscriptions, payment, account management
- **Troubleshooting**: Common issues and solutions
- **FAQs**: Frequently asked questions (integrated, not standalone)

### Tool-Specific Guides

Each AI Service has dedicated help documentation:

**The Time Capsule Guide**:
- How to upload photos
- How to write effective dreams/aspirations
- Understanding results
- Tips for best outcomes

**The Cinematic Switch Guide**:
- Supported media formats
- Scene description best practices
- Video vs. image transformation
- Output quality tips

**Global Voice Guide**:
- Supported languages
- Video requirements
- Lip-sync accuracy
- Script input guidelines

**Instant Influencer Guide**:
- Photo quality requirements
- Style selection guide
- Professional headshot tips
- Download and usage

**Viral Hook Gen Guide**:
- Platform-specific optimization
- Writing effective descriptions
- Caption best practices
- Hashtag strategies

### Search Functionality

**Features**:
- Full-text search across all help content
- Search suggestions and autocomplete
- Filter by category or tool
- Recent searches (if applicable)
- Popular articles

**Search Results**:
- Relevance-ranked results
- Snippet previews
- Direct links to relevant sections
- Related articles suggestions

## FAQs (Frequently Asked Questions)

### Integration with Support

**Not Standalone**: FAQs are integrated into the Support/Help Center, not a separate standalone page.

**Location**:
- Part of Help Center main page
- Tool-specific FAQ sections within each tool guide
- Contextual FAQs in support modal/interface
- Searchable within help content

### FAQ Categories

**General FAQs**:
- Account creation and management
- Credit system and pricing
- Platform usage basics
- Privacy and security

**Tool-Specific FAQs**:
- Questions about each individual tool
- Output quality and expectations
- Processing times
- File format requirements

**Billing FAQs**:
- Credit purchase process
- Subscription management
- Payment methods
- Refund policies

**Technical FAQs**:
- Browser compatibility
- File upload issues
- Error messages
- Performance questions

### FAQ Format

**Structure**:
- Question (clear, user-friendly language)
- Answer (concise, actionable)
- Related links (to detailed guides if applicable)
- Last updated date

**Presentation**:
- Expandable/collapsible sections
- Searchable within FAQ content
- Categorized for easy navigation
- Highlighted popular questions

## Contact Support

### Support Channels

**Contact Form**:
- Available through support floating button
- Accessible from Help Center
- Required fields: email, subject, message
- Optional: tool/service selection, screenshots

**Email Support**:
- Direct email address (if provided)
- Response time expectations
- Business hours (if applicable)

**Live Chat** (if implemented):
- Real-time chat support
- Available during specified hours
- Chat history accessible in account

### Support Request Management

**User Side**:
- Submit support requests
- View request history
- Track request status
- Receive email notifications

**Support Topics**:
- Technical issues
- Billing questions
- Feature requests
- Bug reports
- Account assistance

## Support Content Organization

### Hierarchical Structure

**Level 1: Main Categories**
- Getting Started
- Tools & Services
- Account & Billing
- Troubleshooting

**Level 2: Subcategories**
- Individual tool guides
- Specific feature documentation
- Problem categories

**Level 3: Individual Articles**
- Step-by-step guides
- How-to tutorials
- Explanatory content

### Content Types

**Guides**:
- Step-by-step instructions
- Visual aids (screenshots, diagrams)
- Best practices
- Tips and tricks

**Tutorials**:
- Video tutorials (if applicable)
- Interactive walkthroughs
- Example workflows

**Reference**:
- Technical specifications
- API documentation (if applicable)
- File format requirements
- System requirements

## Accessibility and Usability

### Support Accessibility

**Keyboard Navigation**:
- All support features keyboard accessible
- Tab order logical and intuitive
- Focus states clearly visible

**Screen Reader Support**:
- Proper ARIA labels
- Semantic HTML structure
- Alt text for visual elements

**Mobile Support**:
- Responsive support interface
- Touch-friendly buttons
- Mobile-optimized help content

### User Experience

**Easy Discovery**:
- Support button always visible
- Help links in navigation
- Contextual help where appropriate

**Quick Access**:
- Minimal clicks to find answers
- Search functionality prominent
- Common questions easily accessible

**Clear Communication**:
- Plain language in all help content
- Visual hierarchy for easy scanning
- Actionable instructions

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [Page Structure](02-page-structure.md)
- [Dashboard UX Flow](08-dashboard-ux-flow.md)
