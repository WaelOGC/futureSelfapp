# Services Catalog: Multi-Service AI Suite

**Target Audience**: Clients aged 17–40  
**Platform**: Web Application (Flask Backend + HTML/CSS/JS Frontend)

---

## Service Overview

This document serves as the **Product Catalog** for the five AI-powered services that comprise the Future Self Multi-Service AI Suite. Each service is designed to provide unique value to users through cutting-edge AI technology.

---

## Service 1: The Time Capsule ⏰

**Status**: ✅ **Active** (Currently Implemented)

### Target Audience
- **Primary**: Ages 17–40 seeking self-reflection and future visualization
- **Use Cases**: Personal growth, motivation, milestone planning, life reflection

### User Value
- **Emotional Connection**: See yourself as you'll be in 2050, creating a tangible connection to your future
- **Wisdom & Guidance**: Receive personalized advice from your "future self" based on your current dreams
- **Motivation**: Visualize long-term goals and aspirations through AI-generated aging
- **Memorable Experience**: Create a unique keepsake combining visual transformation with written wisdom

### AI Engine
- **Image Aging**: Replicate API → `black-forest-labs/flux-dev` model
  - Photorealistic aging transformation
  - Maintains recognizable facial features
  - Incorporates user's dream scenario into the aging process
- **Wisdom Letter**: OpenAI → `gpt-4o-mini` model
  - Personalized 100–150 word letters
  - Context-aware based on user's dream input
  - Warm, reflective, and encouraging tone

### Technical Implementation
- **Backend Route**: `/generate` (POST)
- **Input**: Image file + text dream/aspiration
- **Output**: Aged image URL + wisdom letter text
- **Processing Time**: 30–60 seconds

---

## Service 2: The Cinematic Switch 🎬

**Status**: 📋 **Planned** (Not Yet Implemented)

### Target Audience
- **Primary**: Ages 18–35 interested in creative content, social media, and visual storytelling
- **Use Cases**: Social media content creation, creative projects, entertainment, personal branding

### User Value
- **Creative Transformation**: Transform yourself into different scenes, characters, or settings
- **Outfit & Style Changes**: See yourself in different clothing styles, eras, or fashion trends
- **Content Creation**: Generate unique visual content for social media, portfolios, or personal projects
- **Entertainment**: Fun, engaging way to experiment with different looks and scenarios

### AI Engine
- **Video Scene Transformation**: Runway AI API or Leonardo AI API
  - Video-to-video scene transformation
  - Style transfer and scene replacement
  - Outfit and appearance modification
  - High-quality video output (1080p+)
- **Alternative**: Image-based transformation using Flux-dev or Stable Diffusion
  - Scene and background replacement
  - Outfit and style modification
  - Multiple output variations

### Technical Implementation (Planned)
- **Backend Route**: `/generate/cinematic` (POST)
- **Input**: Image/Video file + scene/style description
- **Output**: Transformed video/image URL(s)
- **Processing Time**: 60–120 seconds (estimated)
- **API Integration**: Runway API or Leonardo AI API

---

## Service 3: Global Voice 🌍

**Status**: 📋 **Planned** (Not Yet Implemented)

### Target Audience
- **Primary**: Ages 20–40 in business, education, content creation, or international communication
- **Use Cases**: Multilingual content creation, language learning, global communication, video localization

### User Value
- **Language Translation**: Speak any language fluently in your own voice
- **Lip-Sync Accuracy**: Natural-looking lip movements matching translated audio
- **Content Localization**: Create multilingual versions of your videos for global audiences
- **Professional Quality**: Studio-quality voice cloning and video synchronization

### AI Engine
- **Voice Cloning & Translation**: ElevenLabs API or HeyGen API
  - Voice cloning in multiple languages
  - Natural-sounding speech synthesis
  - Preserves original voice characteristics
- **Lip-Sync Video**: HeyGen API or D-ID API
  - Accurate lip-sync to translated audio
  - Realistic facial animation
  - High-quality video output

### Technical Implementation (Planned)
- **Backend Route**: `/generate/voice` (POST)
- **Input**: Video file + target language + optional text script
- **Output**: Translated video URL with lip-sync
- **Processing Time**: 90–180 seconds (estimated)
- **API Integration**: HeyGen API or ElevenLabs API + D-ID API

---

## Service 4: Instant Influencer 📸

**Status**: 📋 **Planned** (Not Yet Implemented)

### Target Audience
- **Primary**: Ages 18–35 in professional fields, social media, modeling, or personal branding
- **Use Cases**: Professional headshots, LinkedIn photos, portfolio images, social media profiles, dating profiles

### User Value
- **Professional Headshots**: Studio-quality professional photos without hiring a photographer
- **Multiple Styles**: Various professional looks (corporate, creative, casual, formal)
- **Cost-Effective**: Save money on professional photography sessions
- **Quick Turnaround**: Get professional photos in minutes instead of scheduling sessions
- **Consistency**: Generate multiple headshots with consistent quality and style

### AI Engine
- **Professional Headshot Generation**: Flux-dev (Replicate) or specialized headshot models
  - Studio-quality lighting and composition
  - Professional background options
  - Multiple outfit and style variations
  - High-resolution output (4K+)
  - Maintains facial features while enhancing professional appearance

### Technical Implementation (Planned)
- **Backend Route**: `/generate/influencer` (POST)
- **Input**: Image file + style preference (corporate, creative, casual, etc.)
- **Output**: Professional headshot image URL(s) - multiple variations
- **Processing Time**: 45–90 seconds (estimated)
- **API Integration**: Replicate API (Flux-dev) or specialized headshot API

---

## Service 5: Viral Hook Gen 🎯

**Status**: 📋 **Planned** (Not Yet Implemented)

### Target Audience
- **Primary**: Ages 17–30 creating content for TikTok, Instagram Reels, YouTube Shorts
- **Use Cases**: Social media content creation, video captions, hook generation, engagement optimization

### User Value
- **Viral-Worthy Captions**: Generate attention-grabbing hooks and captions optimized for engagement
- **Platform-Specific**: Tailored for TikTok, Instagram Reels, and YouTube Shorts formats
- **Trend Integration**: Incorporate current trends and best practices for each platform
- **Time-Saving**: Quickly generate multiple caption options instead of brainstorming
- **Engagement Optimization**: Data-driven hooks designed to maximize views, likes, and shares

### AI Engine
- **Caption & Hook Generation**: OpenAI → `gpt-4o` model
  - Platform-specific optimization (TikTok, Reels, Shorts)
  - Multiple variations per request
  - Trend-aware content generation
  - Engagement-focused copywriting
  - Hashtag suggestions and optimization

### Technical Implementation (Planned)
- **Backend Route**: `/generate/hook` (POST)
- **Input**: Video description/topic + target platform + optional tone/style
- **Output**: JSON array of caption/hook variations + hashtag suggestions
- **Processing Time**: 5–10 seconds (estimated)
- **API Integration**: OpenAI API (GPT-4o)

---

## Service Comparison Table

| Service | Status | Target Age | Processing Time | AI Engine | Primary Use Case |
|--------|--------|------------|-----------------|-----------|------------------|
| **The Time Capsule** | ✅ Active | 17–40 | 30–60s | Flux-dev + GPT-4o-mini | Self-reflection & future visualization |
| **The Cinematic Switch** | 📋 Planned | 18–35 | 60–120s | Runway/Leonardo AI | Creative content & scene transformation |
| **Global Voice** | 📋 Planned | 20–40 | 90–180s | HeyGen/ElevenLabs | Multilingual video translation |
| **Instant Influencer** | 📋 Planned | 18–35 | 45–90s | Flux-dev | Professional headshot generation |
| **Viral Hook Gen** | 📋 Planned | 17–30 | 5–10s | GPT-4o | Social media caption generation |

---

## Implementation Priority

1. **Phase 1**: ✅ The Time Capsule (Completed)
2. **Phase 2**: Service Dashboard UI (In Progress)
3. **Phase 3**: Backend Routes & API Integration
   - Priority 1: Instant Influencer (fastest to implement, uses existing Flux-dev)
   - Priority 2: Viral Hook Gen (fast API, uses existing OpenAI integration)
   - Priority 3: The Cinematic Switch (medium complexity, new API integration)
   - Priority 4: Global Voice (most complex, multiple API integrations)

---

## API Requirements Summary

| Service | Required APIs | Estimated Cost per Request |
|---------|---------------|---------------------------|
| The Time Capsule | Replicate, OpenAI | $0.10–$0.30 |
| The Cinematic Switch | Runway/Leonardo AI | $0.50–$2.00 |
| Global Voice | HeyGen/ElevenLabs, D-ID | $1.00–$5.00 |
| Instant Influencer | Replicate (Flux-dev) | $0.10–$0.50 |
| Viral Hook Gen | OpenAI (GPT-4o) | $0.05–$0.20 |

---

**Last Updated**: Current as of expansion planning  
**Document Purpose**: Blueprint for Cursor Agent to implement remaining services
