**Title**: User Account System  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Accounts, Backend

---

# User Account System: FutureSelfApp

This document describes the user account system, including what data is stored, how accounts are structured, and the features available to users.

## Account Structure

A FutureSelfApp user account contains the following core components:

### Profile Information
- **Basic Details**:
  - Email address (primary identifier)
  - Password (hashed and secured)
  - Display name (optional)
  - Avatar/profile picture (optional)
  - Account creation date
  - Last login timestamp

- **Security Settings**:
  - Password management
  - Two-factor authentication (if implemented)
  - Active session management
  - Email verification status

### Credits & Usage

#### Credit System
- **Credit Balance**: Current available credits
- **Credit History**: Transaction log of all credit purchases, usage, and adjustments
- **Credit Packages**: Records of purchased credit packages
- **Credit Expiration**: Tracking of credits with expiration dates (if applicable)

#### Usage Tracking
- **Per-Tool Usage**: Credit consumption tracked separately for each tool
- **Generation History**: Complete log of all AI generations across all tools
- **Cost Per Generation**: Record of credits spent per generation
- **Usage Statistics**: Aggregated data (total generations, credits used, favorite tools)

### Saved Work & Memory

#### Tool-Specific Memory
Each AI Service maintains its own memory system for user-generated content:

**The Time Capsule**:
- Saved aged photos
- Wisdom letters
- Original uploaded photos (if user opts to save)
- Dream/aspiration text associated with each generation

**The Cinematic Switch**:
- Original media files (images/videos)
- Transformed outputs
- Scene/style descriptions
- Generation parameters

**Global Voice**:
- Original video files
- Translated video outputs
- Target languages used
- Text scripts (if provided)

**Instant Influencer**:
- Original photos
- Generated headshot variations
- Style preferences used
- Selected favorites

**Viral Hook Gen**:
- Video descriptions
- Generated captions and hooks
- Platform selections
- Hashtag suggestions
- Saved favorites

#### Content Organization
- **Chronological Storage**: All work saved with timestamps
- **Tool Categories**: Content organized by tool/service
- **User Collections**: Optional user-created folders or collections (if implemented)
- **Favorites**: User-marked favorite outputs
- **Tags/Labels**: Optional tagging system for organization (if implemented)

### Subscription Management

#### Subscription Details
- **Active Subscription**: Current subscription plan (if any)
- **Subscription Tier**: Plan level (Basic, Pro, Premium, etc.)
- **Billing Cycle**: Monthly, annual, etc.
- **Renewal Date**: Next billing date
- **Subscription Status**: Active, canceled, expired, etc.

#### Subscription Benefits
- Monthly credit allocations
- Discounted credit rates
- Priority processing
- Access to premium features
- Subscription-specific tool access

### Invite / Referral System

#### Referral Logic
The referral system operates on **conditions-based rewards**:

- **Referral Link**: Unique link assigned to each user
- **Referral Tracking**: Records of users who signed up via referral link
- **Reward Conditions**: Specific conditions that must be met for rewards
  - Example: Referred user must complete first generation
  - Example: Referred user must purchase credits
  - Example: Referred user must remain active for X days
- **Reward Status**: Tracks which conditions have been met
- **Reward Distribution**: Credits or benefits awarded when conditions are satisfied

#### Referral Data
- **Referrer ID**: User who created the referral
- **Referred Users**: List of users who signed up via referral
- **Reward History**: Log of all rewards earned and distributed
- **Pending Rewards**: Rewards awaiting condition fulfillment

### Account Metadata

#### Preferences
- **Email Notifications**: Preferences for various notification types
- **UI Preferences**: Theme preferences, display settings
- **Default Settings**: Tool-specific default preferences

#### Activity Log
- **Login History**: Recent login attempts and locations
- **Account Changes**: History of profile updates, password changes
- **Security Events**: Unusual activity, password resets, etc.

## Account Lifecycle

### Account Creation
1. User signs up with email and password
2. Email verification sent (if required)
3. Initial account created with default settings
4. Welcome credits may be awarded (if applicable)
5. User redirected to dashboard

### Account Usage
- User generates content using tools
- Credits are consumed per generation
- Work is automatically saved to tool-specific memory
- Usage history is updated
- Credits can be purchased as needed

### Account Management
- Users can update profile information
- Password can be changed
- Email preferences can be modified
- Subscription can be managed or canceled
- Account can be deleted (with data removal)

## Data Ownership

All account data, generated content, and user information belong to **FutureSelfApp** as a product. This includes:

- User profile information
- Generated AI outputs (images, videos, text)
- Usage history and statistics
- Saved work and collections
- Payment and billing information
- Referral data

Users have the right to:
- Access their data
- Download their generated content
- Request data deletion
- Export their account data (if implemented)

## Privacy & Security

### Data Protection
- Passwords are hashed and never stored in plain text
- Sensitive data is encrypted at rest
- API keys and payment information are secured
- User data is not shared with third parties (except as required for service operation)

### Content Privacy
- Generated content is private to the user
- Content is not used for training AI models without explicit consent
- Content is not shared publicly unless user explicitly shares it
- Content deletion is permanent and immediate

---

**See also**:
- [Master Documentation Index](00-docs-index.md)
- [Glossary & Canonical Naming](00-glossary.md)
- [User Account Management](10-user-account-management.md)
- [Credits and Subscriptions](07-credits-and-subscriptions.md)
