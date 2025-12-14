# Tools and Memory: Future Self

This document describes how AI tools work conceptually, how user work is saved, and how previous outputs appear in the dashboard.

## Tool Concept Overview

Future Self provides multiple AI-powered tools, each serving a specific purpose and generating different types of content. All tools follow a similar conceptual workflow:

1. **User Input**: User provides media, text, or configuration
2. **AI Processing**: Tool sends input to appropriate AI API
3. **Generation**: AI model processes input and generates output
4. **Result Delivery**: Generated content returned to user
5. **Memory Storage**: Output automatically saved to user's account

## Individual Tool Concepts

### The Time Capsule

**Purpose**: Visualize your future self through AI-powered photo aging and receive personalized wisdom.

**How It Works**:
- User uploads a photo of themselves
- User provides a dream or aspiration as text input
- AI ages the photo to show how they would look in 2050
- AI generates a personalized wisdom letter from their "future self"
- Both outputs are returned together

**Output Types**:
- Aged photo (image)
- Wisdom letter (text)

**Memory Storage**:
- Original uploaded photo (if user opts to save)
- Aged photo output
- Wisdom letter text
- Dream/aspiration text
- Generation timestamp
- Associated metadata

### The Cinematic Switch

**Purpose**: Transform yourself into different scenes, styles, or characters using AI.

**How It Works**:
- User uploads an image or video
- User describes desired scene, style, or transformation
- AI processes the media and applies the transformation
- Transformed media is returned

**Output Types**:
- Transformed image or video
- Multiple variations (if applicable)

**Memory Storage**:
- Original media file (image or video)
- Transformed output(s)
- Scene/style description
- Generation parameters
- Generation timestamp

### Global Voice

**Purpose**: Translate videos to different languages with accurate lip-sync in your own voice.

**How It Works**:
- User uploads a video
- User selects target language
- Optional: User provides text script
- AI translates audio and generates voice in target language
- AI creates lip-synced video with translated audio
- Translated video is returned

**Output Types**:
- Translated video with lip-sync
- Audio file (if applicable)

**Memory Storage**:
- Original video file
- Translated video output
- Target language
- Text script (if provided)
- Generation timestamp
- Processing metadata

### Instant Influencer

**Purpose**: Generate professional headshots in various styles without a photographer.

**How It Works**:
- User uploads a photo
- User selects style preference (corporate, creative, casual, formal)
- AI generates professional headshot variations
- Multiple headshot options are returned

**Output Types**:
- Professional headshot images (multiple variations)
- Style-specific outputs

**Memory Storage**:
- Original photo
- Generated headshot variations
- Selected style preference
- User's favorite selection (if marked)
- Generation timestamp

### Viral Hook Gen

**Purpose**: Generate attention-grabbing captions and hooks optimized for social media platforms.

**How It Works**:
- User provides video description or topic
- User selects target platform (TikTok, Instagram Reels, YouTube Shorts)
- Optional: User selects tone/style preferences
- AI generates multiple caption variations and hashtag suggestions
- Text outputs are returned

**Output Types**:
- Caption/hook variations (text)
- Hashtag suggestions (text)
- Platform-optimized copy

**Memory Storage**:
- Video description/topic
- Generated captions and hooks
- Hashtag suggestions
- Selected platform
- Tone/style preferences
- User's saved favorites
- Generation timestamp

## Memory System Architecture

### Per-Tool Memory

Each tool maintains its own isolated memory system:

**Isolation**:
- Content from one tool is separate from other tools
- Each tool has its own history and saved work
- Tool-specific organization and categorization

**Storage Structure**:
- **Tool Category**: All content tagged with originating tool
- **Chronological Order**: Timestamp-based organization
- **Input-Output Pairs**: Original inputs stored with generated outputs
- **Metadata**: Generation parameters, settings, and context

### Automatic Saving

**Default Behavior**:
- All generated outputs are automatically saved to user's account
- No manual save action required
- Saving happens immediately after generation completes

**User Control**:
- Users can delete saved work if desired
- Users can opt out of saving original inputs (if applicable)
- Users can organize saved work into collections (if implemented)

### Memory Access

**Dashboard Integration**:
- Each tool's dashboard view shows its own history
- Previous outputs appear below current generation area
- Quick access to reuse or reference past work

**History View**:
- Chronological list of all generations for the tool
- Filter and search capabilities
- Batch actions (delete, download, organize)

**Saved Work View**:
- Organized collection of user's saved outputs
- Tool-specific sections
- User-created collections or folders (if implemented)

## Previous Outputs in Dashboard

### Display Location

**Within Tool View**:
- Previous outputs appear in the main workspace area
- Positioned below current generation interface
- Scrollable list or grid layout

**History Section**:
- Dedicated history view accessible from dashboard navigation
- Shows all generations across all tools (with filtering)
- Or shows tool-specific history when accessed from within tool

### Display Format

**Visual Outputs** (Images, Videos):
- Thumbnail previews
- Click to view full size
- Quick actions: download, delete, reuse

**Text Outputs** (Letters, Captions):
- Text preview with truncation
- Click to expand full text
- Quick actions: copy, download, delete

**Metadata Display**:
- Generation date and time
- Tool used
- Credits consumed
- Input summary (if applicable)

### Reuse Functionality

**Regeneration**:
- Users can regenerate with same inputs
- Previous inputs can be edited and regenerated
- Quick access to previous generation parameters

**Reference**:
- Previous outputs can be referenced while creating new content
- Side-by-side comparison (if applicable)
- Inspiration from past work

## Memory Categories

### User-Generated Content Categories

**By Tool**:
- Time Capsule content
- Cinematic Switch content
- Global Voice content
- Instant Influencer content
- Viral Hook Gen content

**By Type**:
- Images (photos, headshots, transformations)
- Videos (translations, transformations)
- Text (letters, captions, hooks)

**By Status**:
- Recent (last 30 days)
- Favorites (user-marked)
- Archived (older content)
- Deleted (soft-deleted, recoverable for limited time)

**By Organization** (if user collections implemented):
- User-created folders
- Tagged content
- Custom collections

## Data Retention

### Storage Duration
- Generated content stored indefinitely (unless user deletes)
- Original inputs stored based on user preference
- Deleted content retained for recovery period (if applicable)

### Storage Limits
- Per-user storage limits (if implemented)
- Tool-specific limits (if applicable)
- Premium tiers with increased storage (if applicable)

---

**Document Purpose**: Reference for tool functionality and memory system architecture  
**Last Updated**: Project documentation foundation creation  
**Maintained By**: Development team
