**Title**: Page Structure  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: UI, Routing

---

# Page Structure: FutureSelfApp

This document outlines all planned pages for the FutureSelfApp web application. Each page serves a specific purpose in the user journey and platform architecture.

## Public Pages

### Landing Page
**Route**: `/`  
**Purpose**: Primary entry point for new and returning users. Introduces FutureSelfApp, explains value proposition, and guides users to sign up or log in.  
**Key Elements**:
- Hero section with value proposition
- Service overview
- How it works
- Call-to-action for account creation
- Trust and philosophy statements

### Blog
**Route**: `/blog`  
**Purpose**: Content marketing and SEO. Provides articles, tutorials, case studies, and updates about FutureSelfApp AI Services.  
**Key Elements**:
- Article listings
- Individual blog post pages
- Categories and tags
- Search functionality
- Related articles

### Support / Help Center
**Route**: `/support` or `/help`  
**Purpose**: Centralized help and support resources. Users can find answers, tutorials, and contact support.  
**Key Elements**:
- Tool-specific guides
- Frequently Asked Questions (FAQs)
- Searchable knowledge base
- Contact support form
- Video tutorials (if applicable)

## Authenticated Pages

### Dashboard
**Route**: `/dashboard`  
**Purpose**: Main workspace after login. Provides access to all AI Services, displays user's work history, and shows account status.  
**Key Elements**:
- Left sidebar navigation (services/tools)
- Tool-specific workspace area
- User work history and saved outputs
- Account status and credit balance
- Quick access to recent work

### Tools Pages

#### The Time Capsule
**Route**: `/dashboard/time-capsule`  
**Purpose**: AI-powered photo aging and wisdom letter generation tool.  
**Key Elements**:
- Image upload interface
- Dream/aspiration input
- Generation controls
- Results display (aged photo + letter)
- Save and download options

#### The Cinematic Switch
**Route**: `/dashboard/cinematic-switch`  
**Purpose**: Video and image scene transformation tool.  
**Key Elements**:
- Media upload (image or video)
- Scene/style description input
- Transformation controls
- Results display
- Save and download options

#### Global Voice
**Route**: `/dashboard/global-voice`  
**Purpose**: Multilingual video translation with lip-sync.  
**Key Elements**:
- Video upload interface
- Target language selector
- Optional text script input
- Results display (translated video)
- Save and download options

#### Instant Influencer
**Route**: `/dashboard/instant-influencer`  
**Purpose**: Professional headshot generation tool.  
**Key Elements**:
- Image upload interface
- Style preference selector (corporate, creative, casual, formal)
- Generation controls
- Results display (multiple headshot variations)
- Save and download options

#### Viral Hook Gen
**Route**: `/dashboard/viral-hook-gen`  
**Purpose**: Social media caption and hook generation tool.  
**Key Elements**:
- Video description input
- Platform selector (TikTok, Instagram Reels, YouTube Shorts)
- Tone/style preferences
- Results display (multiple caption variations + hashtags)
- Copy and save options

## User Account Pages

### Account Settings
**Route**: `/dashboard/account` or `/account`  
**Purpose**: User profile management and account configuration.  
**Key Elements**:
- Profile information (name, email, avatar)
- Password change
- Email preferences
- Account deletion

### Credits & Billing
**Route**: `/dashboard/credits` or `/billing`  
**Purpose**: Credit purchase, subscription management, and billing history.  
**Key Elements**:
- Current credit balance
- Credit purchase options
- Subscription plan selection and management
- Billing history
- Payment method management

### Usage History
**Route**: `/dashboard/history` or `/history`  
**Purpose**: View all past tool usage and generated content.  
**Key Elements**:
- Chronological list of all generations
- Filter by tool/service
- Search functionality
- Download and reuse options
- Credit usage per generation

### Saved Work
**Route**: `/dashboard/saved` or `/saved`  
**Purpose**: Access user's saved and organized work across all tools.  
**Key Elements**:
- Organized by tool category
- Custom folders/collections (if implemented)
- Quick access to saved outputs
- Share options (if applicable)

### Invite / Referral
**Route**: `/dashboard/invite` or `/referrals`  
**Purpose**: Referral system for inviting new users with rewards.  
**Key Elements**:
- Unique referral link
- Referral status and rewards
- Invite tracking
- Conditions-based reward display
- Share referral link options

## Legal & Information Pages

### Privacy Policy
**Route**: `/privacy`  
**Purpose**: Legal document explaining how FutureSelfApp collects, uses, and protects user data.  
**Key Elements**:
- Data collection practices
- Data usage and storage
- User rights
- Cookie policy
- Contact information for privacy concerns

### Terms of Service
**Route**: `/terms`  
**Purpose**: Legal agreement between Future Self and users.  
**Key Elements**:
- Service description
- User obligations
- Intellectual property rights
- Limitation of liability
- Dispute resolution

### Cookie Policy
**Route**: `/cookies`  
**Purpose**: Detailed explanation of cookie usage on the platform.  
**Key Elements**:
- Types of cookies used
- Purpose of each cookie
- Cookie management options
- Third-party cookies

### About
**Route**: `/about`  
**Purpose**: Information about FutureSelfApp as a product (not OGC NewFinity).  
**Key Elements**:
- Product mission and vision
- Service overview
- Team information (if applicable)
- Contact information

## Navigation Structure

### Public Navigation
- Landing Page
- Blog
- Support
- Login / Sign Up

### Authenticated Navigation (Dashboard)
- Dashboard (home)
- Tools (Time Capsule, Cinematic Switch, Global Voice, Instant Influencer, Viral Hook Gen)
- Account Settings
- Credits & Billing
- Usage History
- Saved Work
- Invite / Referral
- Logout

### Footer Navigation (All Pages)
- Privacy Policy
- Terms of Service
- Cookie Policy
- About
- Support / Help Center
- Blog

## Page Access Rules

### Public Access
- Landing Page
- Blog
- Support / Help Center
- Legal pages (Privacy, Terms, Cookies)
- About

### Authenticated Access Required
- Dashboard
- All tool pages
- Account settings
- Credits & billing
- Usage history
- Saved work
- Invite / referral

### Redirect Behavior
- Unauthenticated users accessing protected pages → Redirect to Landing Page with login prompt
- Authenticated users accessing `/` → Redirect to Dashboard

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [Dashboard Architecture](04-dashboard-architecture.md)
- [Dashboard UX Flow](08-dashboard-ux-flow.md)
