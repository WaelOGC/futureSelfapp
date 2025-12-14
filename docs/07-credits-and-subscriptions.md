# Credits and Subscriptions: Future Self

This document defines the user account types, credits system, subscription logic, usage limits, multi-AI provider strategy, referral program, and user transparency for the Future Self platform.

## Account Types

### Guest (Unregistered User)

**Definition**: A user who accesses Future Self without creating an account.

**Capabilities**:
- View landing page and marketing content
- Browse public information (blog, about page, support documentation)
- Cannot access any AI tools
- Cannot generate content
- Cannot save work
- Cannot purchase credits or subscribe

**Limitations**:
- No access to dashboard
- No tool usage
- No account features
- No saved work or history

**Purpose**: Allows users to explore the platform before committing to account creation. All tool usage requires account registration.

### Free Registered User

**Definition**: A user who has created an account but has not purchased credits or subscribed.

**Capabilities**:
- Full access to dashboard interface
- Access to all AI tools (when credits are available)
- Daily free credits (if implemented)
- Can purchase credit packages
- Can subscribe to plans
- Full access to account features (history, saved work, settings)
- Can participate in referral program
- Can receive referral rewards

**Limitations**:
- Limited or no free credits (daily allocation only, if any)
- Cannot use tools without credits
- No subscription benefits
- Standard processing priority
- No access to premium features (if any)

**Credit Access**:
- Daily free credits (small allocation, if implemented)
- Must purchase credits for regular usage
- Can earn credits through referrals (conditions-based)

### Paid User (Subscriber)

**Definition**: A user with an active subscription plan.

**Capabilities**:
- All capabilities of free registered users
- Monthly credit allocation (included with subscription)
- Discounted credit rates (when purchasing additional credits)
- Priority processing (faster generation times)
- Access to premium features (if any)
- Subscription-specific tool access (if any tools are subscription-only)
- Enhanced support (if applicable)

**Limitations**:
- Subscription must remain active for benefits
- Benefits expire when subscription ends
- May have usage limits even with subscription

**Subscription Benefits**:
- Monthly credit allocation (credits added automatically each billing cycle)
- Reduced credit costs for additional purchases
- Priority queue for AI processing
- Exclusive features or tools (if any)
- Enhanced account limits (storage, history retention, etc.)

**Transition**:
- When subscription expires, user becomes free registered user
- Retained credits remain available
- Saved work remains accessible
- Subscription benefits cease immediately upon expiration

### Admin (Conceptual)

**Definition**: Internal administrative account for platform management.

**Capabilities** (Conceptual Only):
- System configuration and management
- User account oversight (support purposes only)
- Credit adjustments (for support cases)
- Subscription management
- Platform analytics and monitoring
- Content moderation (if applicable)

**User-Facing**: Admins are not a user-facing account type. This is purely for internal system management and support operations.

## Credits System

### What is a Credit?

**Definition**: A credit is a unit of consumption that represents the cost of using an AI tool to generate content.

**Purpose**:
- Standardized measurement of tool usage
- Flexible pricing model that accommodates different tool complexities
- Transparent cost structure for users
- Enables fair usage tracking and limits

**Value**: Credits do not have a fixed monetary value. Instead, they represent the relative cost of different AI operations, accounting for:
- Computational complexity
- API provider costs
- Processing time
- Resource consumption

### Credit Consumption

**Per-Tool Consumption**:
- Each AI tool consumes a specific number of credits per generation
- Credit costs vary by tool based on complexity and processing requirements
- Costs are displayed to users before generation
- Credits are deducted immediately upon successful generation

**Per-Action Consumption**:
- **Generation**: Primary credit consumption (one generation = one deduction)
- **Regeneration**: Consumes credits again (treated as new generation)
- **No Consumption**: Viewing history, downloading saved work, browsing tools

**Tool-Specific Costs** (Conceptual):
- Simple tools (text generation): Lower credit cost
- Medium complexity (image generation): Moderate credit cost
- High complexity (video processing, multi-step operations): Higher credit cost
- Costs reflect actual API and processing expenses

**Failed Generations**:
- Credits are not consumed if generation fails before processing begins
- Credits are consumed if generation starts but fails (user receives error, credits deducted)
- Refunds may be issued for technical failures (support decision)

### Credit Types

#### Daily Free Credits

**Definition**: Small allocation of credits granted daily to registered users (if implemented).

**Purpose**:
- Allow users to try tools without immediate payment
- Demonstrate platform value
- Encourage account creation and engagement

**Characteristics**:
- Small daily allocation (conceptual amount)
- Reset at midnight (user's timezone or UTC)
- Do not accumulate (unused credits do not carry over)
- Cannot be transferred or saved
- Expire at end of day if unused

**Limitations**:
- Insufficient for regular usage
- Intended for occasional testing
- Not available to all account types (may be subscription-only benefit)

#### Purchased Credits

**Definition**: Credits acquired through direct purchase via credit packages.

**Purpose**:
- Primary method of accessing AI tools
- Flexible pay-as-you-go model
- No subscription commitment required

**Characteristics**:
- Purchased in packages (various sizes)
- Added to account balance immediately upon purchase
- No expiration (unless specified in package terms)
- Can be used for any tool
- Remaining balance persists indefinitely

**Package Types** (Conceptual):
- Small packages: Fewer credits, lower price point
- Medium packages: Moderate credits, standard pricing
- Large packages: Many credits, better value per credit
- Bonus credits: Extra credits included in larger packages

**Usage**:
- Deducted per generation
- Balance visible in dashboard
- Can be supplemented with subscription credits

#### Bonus / Referral Credits

**Definition**: Credits earned through referral program, promotions, or special offers.

**Purpose**:
- Reward user referrals and engagement
- Incentivize platform growth
- Compensate for special circumstances (support cases, promotions)

**Characteristics**:
- Earned through referral program (conditions-based)
- May have expiration dates (if specified)
- May have usage restrictions (if specified)
- Treated same as purchased credits for tool usage
- Tracked separately in credit history for transparency

**Referral Credits**:
- Awarded when referral conditions are met
- Conditions prevent instant free credits (anti-abuse)
- May have expiration (e.g., 90 days from award)
- Cannot be transferred between accounts

**Promotional Credits**:
- Awarded during special promotions
- May have expiration dates
- Subject to promotion terms
- Tracked in credit history

### Credit Expiration Rules

**General Rule**: Purchased credits do not expire unless explicitly stated.

**Expiration Scenarios**:
- **Daily Free Credits**: Expire at end of day if unused
- **Bonus Credits**: May expire after specified period (e.g., 90 days)
- **Promotional Credits**: Expire per promotion terms
- **Subscription Credits**: May expire if subscription lapses (depends on plan terms)

**Expiration Handling**:
- Users notified before credits expire (if applicable)
- Expired credits removed from balance automatically
- Expiration dates visible in credit history
- Oldest credits consumed first (FIFO: First In, First Out)

**No Expiration Default**:
- Standard purchased credits have no expiration
- Users can accumulate credits over time
- Credits remain available as long as account is active

## Subscriptions

### Why Subscriptions Exist

**Purpose**:
- Provide predictable monthly access for regular users
- Offer better value for frequent users
- Enable priority features and processing
- Create recurring revenue for platform sustainability

**Value Proposition**:
- Monthly credit allocation (better value than purchasing equivalent credits)
- Discounted additional credit purchases
- Priority processing (faster generation times)
- Exclusive features or tools (if any)
- Enhanced account limits

**Target Users**:
- Regular users who generate content frequently
- Professional users requiring consistent access
- Users who prefer predictable monthly costs
- Users who value priority processing

### What Subscriptions Unlock

#### Monthly Credit Allocation
- Automatic credit deposit each billing cycle
- Credits added to account balance
- Can be used immediately upon allocation
- May expire if subscription lapses (depends on plan terms)

#### Discounted Credit Rates
- Reduced cost per credit when purchasing additional credits
- Percentage discount varies by subscription tier
- Applies to all credit package purchases
- Discount active only while subscription is active

#### Priority Processing
- Faster generation queue (subscribers processed before free users)
- Reduced wait times during high traffic
- Guaranteed processing priority
- Better user experience during peak usage

#### Premium Features
- Access to exclusive tools (if any subscription-only tools exist)
- Enhanced account limits (storage, history retention)
- Advanced tool options or settings
- Early access to new features

#### Enhanced Support
- Priority support queue (if implemented)
- Faster response times
- Dedicated support channel (if applicable)

### Relationship Between Subscription and Credits

**Independent Systems**:
- Subscriptions provide monthly credit allocation
- Users can still purchase additional credits (with discount)
- Subscription credits and purchased credits combine in single balance
- All credits (subscription + purchased) are consumed the same way

**Credit Usage**:
- Subscription credits are consumed first (FIFO or subscription-first policy)
- Or: Oldest credits consumed first regardless of source
- Users see combined balance, not separate balances
- Credit history shows source (subscription vs. purchased vs. bonus)

**Subscription Without Credits**:
- Subscription provides monthly allocation
- If allocation is insufficient, users purchase additional credits
- Subscription benefits (discount, priority) apply to additional purchases
- Subscription does not provide unlimited usage

**Credits Without Subscription**:
- Users can purchase credits without subscribing
- Pay-as-you-go model available
- No subscription benefits (no discount, standard priority)
- Suitable for occasional users

### Subscription Expiration

**When Subscription Expires**:
- Monthly allocation stops
- Discounted credit rates end
- Priority processing ends
- Premium features become unavailable
- Account reverts to free registered user status

**What Remains**:
- Purchased credits remain in balance
- Saved work remains accessible
- Account history remains available
- User can continue using tools with remaining credits

**What Changes**:
- No new monthly credit allocation
- Credit purchases return to standard pricing
- Processing returns to standard priority
- Premium features become inaccessible

**Reactivation**:
- User can resubscribe at any time
- Benefits restore immediately upon reactivation
- Previous subscription tier available (or current tiers)
- No penalty for cancellation and reactivation

**Grace Period** (if implemented):
- Short grace period after expiration (e.g., 7 days)
- Benefits may remain active during grace period
- Allows time for payment issues to resolve
- After grace period, full expiration applies

## Usage Limits & Protection

### Abuse Prevention

**Purpose**: Protect platform resources, ensure fair usage, and maintain service quality for all users.

**Anti-Abuse Measures**:

**Rate Limiting**:
- Maximum generations per hour/day per user
- Prevents rapid-fire generation attempts
- Protects against automated abuse
- Limits apply regardless of credit balance

**Account Verification**:
- Email verification required for account creation
- Prevents disposable email abuse
- May require phone verification for high-value accounts (if implemented)

**Credit Purchase Limits**:
- Maximum credit purchase per transaction (if applicable)
- Maximum credit balance cap (if applicable)
- Prevents money laundering or suspicious activity

**Generation Quality Checks**:
- Input validation (file size, format, content)
- Output validation (quality checks)
- Prevents malicious or inappropriate content generation

**IP and Device Tracking**:
- Monitor for suspicious patterns
- Detect automated scripts or bots
- Flag accounts with unusual behavior
- May require additional verification

### Daily Caps

**Purpose**: Ensure fair resource distribution and prevent single-user monopolization.

**Daily Generation Limits**:
- Maximum number of generations per day per user
- Applies across all tools (combined limit)
- Or: Per-tool daily limits
- Resets at midnight (user timezone or UTC)

**Limit Types**:
- **Hard Cap**: Cannot generate after limit reached (even with credits)
- **Soft Cap**: Can generate but with reduced priority or additional cost
- **Tiered Limits**: Higher limits for subscribers vs. free users

**Limit Enforcement**:
- Clear messaging when limit approached
- Notification when limit reached
- Option to purchase higher tier for increased limits (if applicable)
- Limits reset automatically at midnight

**Exceptions**:
- Subscribers may have higher daily limits
- Premium tiers may have unlimited daily usage (if applicable)
- Support can adjust limits for legitimate use cases

### Fair-Use Rules

**Definition**: Guidelines ensuring platform resources are used appropriately and fairly.

**Fair Use Principles**:
- Personal and professional use allowed
- Commercial use allowed (within terms of service)
- Bulk generation for legitimate purposes allowed
- Automated generation via API (if implemented) subject to rate limits

**Prohibited Use**:
- Generating content for resale as a service (competing with Future Self)
- Automated bulk generation without proper authorization
- Attempting to reverse-engineer AI models
- Using platform to train competing AI systems
- Any use violating terms of service

**Enforcement**:
- Automated detection of suspicious patterns
- Manual review of flagged accounts
- Warnings for first violations
- Account suspension or termination for repeated violations

### Zero Credits Behavior

**When Credits Reach Zero**:
- User cannot initiate new generations
- All tools show "insufficient credits" message
- Clear call-to-action to purchase credits or subscribe
- Dashboard displays credit balance prominently

**What Remains Accessible**:
- Viewing saved work and history
- Downloading previous generations
- Account settings and management
- Credit purchase and subscription management
- Support and help resources

**Credit Purchase Flow**:
- Prominent "Buy Credits" button in dashboard
- Credit packages clearly displayed
- Subscription options presented
- Seamless purchase and immediate credit addition

**User Experience**:
- No hidden restrictions or confusing error messages
- Clear explanation of why generation is unavailable
- Easy path to restore access (purchase credits)
- No pressure tactics, just clear information

## Multi-AI Provider Strategy

### Why Multiple AI Providers

**Purpose**: Ensure reliability, quality, and cost-effectiveness by leveraging multiple AI service providers.

**Reliability**:
- Redundancy: If one provider has issues, others can handle requests
- Uptime: Multiple providers reduce single point of failure
- Service continuity: Platform remains operational during provider outages

**Quality**:
- Best-in-class selection: Use the best provider for each specific task
- Quality comparison: Internal testing determines optimal provider per tool
- Continuous improvement: Can switch providers as better options emerge

**Cost Optimization**:
- Competitive pricing: Multiple providers enable cost comparison
- Dynamic selection: Choose most cost-effective provider per request
- Negotiation leverage: Multiple options improve pricing terms

**Innovation**:
- Access to latest models: Different providers offer different cutting-edge models
- Feature diversity: Some providers excel in specific areas (image, video, text)
- Future-proofing: Not locked into single provider's roadmap

### User Transparency

**Provider Names Hidden**:
- Users never see which AI provider is used
- No mention of Replicate, OpenAI, Runway, etc. in user interface
- Branding is "Future Self AI" only
- Technical details are internal implementation

**User Experience**:
- Seamless experience regardless of provider
- Consistent interface and workflow
- No provider-specific differences visible to users
- Quality and reliability are platform responsibilities

**Why Hide Providers**:
- Simplifies user experience (no technical complexity)
- Protects business relationships (provider confidentiality)
- Allows provider changes without user confusion
- Maintains Future Self brand consistency

### Best Source Selection

**Internal Logic** (Conceptual):
- System evaluates available providers for each request
- Selection based on: quality, cost, availability, speed
- Dynamic routing: Best provider chosen per generation
- Fallback logic: If primary provider fails, automatically try alternatives

**Selection Factors**:
- **Quality**: Which provider produces best results for this tool
- **Cost**: Most cost-effective option that meets quality standards
- **Availability**: Provider uptime and current load
- **Speed**: Processing time and queue length
- **Reliability**: Historical success rate for this tool type

**Transparency to Users**:
- Users do not see selection process
- Users do not choose providers
- System handles all routing automatically
- Users receive consistent, high-quality results

**Provider-Specific Optimization**:
- Each tool may use different provider
- Provider selection optimized per tool type
- Can change providers without user impact
- Continuous monitoring and optimization

### Benefits to Users

**Quality**:
- Always receive best-available quality for each tool
- No compromise due to single-provider limitations
- Continuous improvement as better providers emerge

**Reliability**:
- Service remains available even if one provider has issues
- Automatic failover to backup providers
- Consistent uptime and availability

**Performance**:
- Fastest processing times (system selects fastest available)
- Reduced wait times during high traffic
- Optimized routing for speed

**Value**:
- Cost savings passed to users (better credit value)
- Competitive pricing maintained
- Best features from multiple providers

**Simplicity**:
- No need to understand technical details
- No provider selection complexity
- Just use tools and get results

## Referral / Invite Program

### How Invite Links Work

**Unique Referral Links**:
- Each registered user receives unique referral link
- Link format: `futureself.com/invite/[unique-code]` or similar
- Link is permanent (does not expire)
- Can be shared via any method (email, social media, etc.)

**Link Tracking**:
- System tracks which user created each referral link
- Records when link is clicked
- Associates new signups with referrer
- Maintains referral relationship in database

**Signup Process**:
- New user clicks referral link
- Link code stored in session or cookie
- When new user creates account, referral is recorded
- Referral relationship established immediately

**Referral Attribution**:
- Attribution happens at account creation
- Cannot be changed after signup
- One referral per new user account
- Prevents multiple referrers for same account

### Conditions for Rewards

**Purpose**: Prevent abuse and ensure legitimate referrals.

**Reward Conditions** (Examples):
- Referred user must complete account verification (email)
- Referred user must complete first successful generation
- Referred user must remain active for X days (e.g., 7-30 days)
- Referred user must purchase credits (if applicable)

**Anti-Abuse Rules**:
- **No Instant Free Credits**: Rewards not given immediately upon signup
- **Verification Required**: Referred user must verify email
- **Activity Required**: Referred user must actually use platform
- **Time-Based**: Rewards only after conditions met for specified duration

**Condition Tracking**:
- System monitors referred user's activity
- Tracks progress toward reward conditions
- Updates reward status in real-time
- Notifies referrer when conditions are met

**Multiple Conditions**:
- May require multiple conditions (e.g., verification + first generation + 7 days active)
- All conditions must be met for reward
- Partial progress tracked but no partial rewards

### What the Inviter Gets

**Reward Types** (Conceptual):
- Credits added to account balance
- Bonus credits for each successful referral
- Subscription discounts (if applicable)
- Exclusive features or early access

**Reward Amount**:
- Fixed amount per successful referral
- Or: Percentage of referred user's first purchase
- Or: Tiered rewards (more referrals = better rewards)
- Rewards clearly communicated in referral dashboard

**Reward Timing**:
- Rewards granted when all conditions are met
- Immediate credit addition to account
- Notification when reward is earned
- Visible in credit history

**Reward Limits** (if applicable):
- Maximum rewards per month (if implemented)
- Maximum total referrals that earn rewards (if implemented)
- Prevents abuse while allowing legitimate growth

### What the Invited User Gets

**Welcome Benefits** (if applicable):
- Small welcome credit allocation
- Or: Discount on first credit purchase
- Or: Extended trial period (if applicable)
- Benefits clearly communicated during signup

**Standard Account**:
- Invited users receive standard account features
- Same capabilities as any new registered user
- No special restrictions
- Can participate in referral program themselves

**Transparency**:
- Invited users know they were referred (if disclosed)
- Can see who referred them (if applicable)
- Referral relationship does not affect account functionality
- Same experience as non-referred users

### Anti-Abuse Rules

**Prevention Measures**:

**Self-Referral Prevention**:
- Cannot refer yourself (same email, device, IP)
- System detects and blocks self-referrals
- Multiple accounts from same user flagged

**Duplicate Account Prevention**:
- One referral per email address
- Cannot create multiple accounts to game system
- System detects duplicate signups

**Bot and Automation Prevention**:
- Email verification required
- Activity verification (actual tool usage)
- Time-based conditions prevent instant rewards
- Pattern detection for suspicious referral activity

**Fraud Detection**:
- Monitor for coordinated referral abuse
- Flag accounts with unusual referral patterns
- Manual review of suspicious cases
- Penalties for abuse (account suspension, reward revocation)

**Fair Use**:
- Legitimate referrals encouraged
- Organic growth supported
- Clear rules prevent confusion
- Support available for questions

## Transparency for Users

### Credit Balance Visibility

**Dashboard Display**:
- Credit balance prominently displayed in dashboard header
- Always visible when logged in
- Updates in real-time after purchases or usage
- Clear, large number format

**Balance Components** (if shown):
- Total available credits
- Or: Breakdown by source (purchased, subscription, bonus)
- Credit expiration dates (if applicable)
- Upcoming subscription credit allocation (if subscribed)

**Low Balance Warnings**:
- Notification when balance is low (e.g., below 10 credits)
- Warning before attempting generation with insufficient credits
- Clear messaging about credit requirements
- Easy path to purchase more credits

**Credit History**:
- Detailed transaction log accessible from dashboard
- Shows all credit additions (purchases, subscriptions, bonuses, referrals)
- Shows all credit deductions (tool usage)
- Timestamps and descriptions for each transaction
- Filterable by date, type, tool

### Usage History Visibility

**Comprehensive History**:
- All generations across all tools in chronological order
- Accessible from dashboard navigation
- Shows: tool used, date/time, credits consumed, output preview
- Filterable by tool, date range, credit cost

**Per-Tool History**:
- Tool-specific history within each tool's dashboard view
- Previous outputs visible below current generation area
- Quick access to past work
- Regeneration from history

**Usage Statistics**:
- Total generations count
- Total credits consumed
- Most-used tools
- Usage trends over time
- Accessible from account or history page

**Export Options** (if implemented):
- Download usage history as CSV or PDF
- Export for personal records
- Data portability feature

### Subscription Status Visibility

**Subscription Dashboard**:
- Current subscription status clearly displayed
- Active subscription: Plan name, tier, benefits listed
- No subscription: Options to subscribe prominently shown
- Status visible in account settings

**Subscription Details**:
- Current plan name and tier
- Billing cycle (monthly, annual)
- Next billing date
- Monthly credit allocation amount
- Discount percentage (for additional credit purchases)
- Premium features included

**Renewal Information**:
- Next billing date prominently displayed
- Auto-renewal status (on/off)
- Payment method on file
- Billing history accessible

**Expiration Warnings**:
- Notification before subscription expires (e.g., 7 days before)
- Reminder of benefits that will be lost
- Easy renewal or reactivation path
- Clear communication about what changes

**Cancellation Transparency**:
- Clear cancellation process
- Information about what happens after cancellation
- What remains (credits, saved work)
- What is lost (benefits, monthly allocation)
- Easy reactivation if user changes mind

### Information Clarity

**Avoiding Confusion**:

**Clear Credit Costs**:
- Credit cost displayed before every generation
- "You will use X credits" message
- Balance check before processing
- Confirmation if balance is low

**Clear Subscription Benefits**:
- Benefits listed clearly when subscribing
- Comparison between subscription and pay-as-you-go
- What's included vs. what costs extra
- No hidden fees or surprises

**Clear Error Messages**:
- "Insufficient credits" instead of generic errors
- "Daily limit reached" with explanation
- "Subscription expired" with next steps
- Actionable error messages with solutions

**Clear Pricing**:
- Credit package prices clearly displayed
- Subscription pricing transparent
- No hidden costs or fees
- Total cost shown before purchase

**Help and Support**:
- FAQ section addresses common questions
- Support available for clarification
- Tooltips and help text where needed
- Documentation accessible from dashboard

---

**Document Purpose**: Reference for credits, subscriptions, and account access logic  
**Last Updated**: Project documentation foundation creation  
**Maintained By**: Development team
