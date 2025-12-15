**Title**: Technical Roadmap  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Platform

---

# Technical Roadmap: FutureSelfApp

This document outlines the development plan, key decisions, and future enhancements for the FutureSelfApp application.

## Phase 1: Foundation (Completed ✅)

### UI Structure
- ✅ Responsive two-column layout with card-based design
- ✅ Dark-themed gradient background with modern aesthetics
- ✅ Drag-and-drop image upload functionality
- ✅ Text area for dream input
- ✅ Loading states and error handling UI
- ✅ Results display area with fade-in animations

### Flask Server Setup
- ✅ Flask application with CORS enabled
- ✅ File upload handling with size limits (16MB)
- ✅ Secure filename handling with `werkzeug.utils.secure_filename`
- ✅ Temporary file storage in `uploads/` directory
- ✅ Automatic file cleanup after processing
- ✅ Error handling and JSON response formatting

### API Integration
- ✅ **Replicate API Integration**:
  - Direct HTTP requests to Replicate API (no SDK)
  - Image upload to Replicate file storage
  - Prediction creation and polling mechanism
  - Flux-dev model integration for photo aging
  - Timeout handling (max 2 minutes)
  
- ✅ **OpenAI API Integration**:
  - GPT-4o-mini model for wisdom letter generation
  - System prompt for consistent letter style
  - 100-word letter generation with token limits
  - Temperature tuning for creative but coherent output

### Frontend-Backend Communication
- ✅ FormData API for file uploads
- ✅ Fetch API for asynchronous requests
- ✅ Error handling and user feedback
- ✅ Loading states during API processing

## Phase 2: Service Dashboard UI (Planned 📋)

### Objective
Design and implement a unified "Service Dashboard" interface that allows users to select between the 5 AI tools in the Multi-Service AI Suite.

### UI Components
- [ ] **Service Selection Grid**: Card-based layout displaying all 5 services
  - Service 1: The Time Capsule (Active)
  - Service 2: The Cinematic Switch (Planned)
  - Service 3: Global Voice (Planned)
  - Service 4: Instant Influencer (Planned)
  - Service 5: Viral Hook Gen (Planned)
- [ ] **Service Cards**: Each card should display:
  - Service name and icon/emoji
  - Brief description (1-2 sentences)
  - Status badge (Active/Coming Soon)
  - "Try Now" or "Coming Soon" button
- [ ] **Navigation System**: 
  - Home/dashboard view with all services
  - Individual service pages with dedicated UI
  - Back navigation to service selection
- [ ] **Responsive Design**: 
  - Mobile-friendly grid (1 column on mobile, 2-3 columns on desktop)
  - Consistent with existing dark theme
  - Smooth transitions between service views

### HTML Structure
- [ ] Update `templates/index.html` to include:
  - Service dashboard as landing page
  - Service-specific forms/inputs for each tool
  - Unified loading states and error handling
  - Results display area adaptable to different output types

### Frontend Enhancements
- [ ] **Service-Specific Forms**:
  - Time Capsule: Image upload + dream text (existing)
  - Cinematic Switch: Image/video upload + scene/style description
  - Global Voice: Video upload + target language selector
  - Instant Influencer: Image upload + style selector (corporate/creative/casual)
  - Viral Hook Gen: Video description + platform selector (TikTok/Reels/Shorts)
- [ ] **Dynamic UI Loading**: Load service-specific form based on selection
- [ ] **Unified Results Display**: Adapt to show images, videos, or text based on service

### CSS/Design
- [ ] Maintain existing dark gradient theme
- [ ] Add service-specific color accents for visual distinction
- [ ] Card hover effects and animations
- [ ] Loading states for each service type
- [ ] Mobile-responsive service grid

## Phase 3: Backend Routes & API Integration (Planned 📋)

### Objective
Create individual backend routes for each of the 4 new services and integrate their respective AI APIs.

### Service 2: The Cinematic Switch
- [ ] **Route**: `/generate/cinematic` (POST)
- [ ] **Input Handling**:
  - Accept image or video file upload
  - Accept scene/style description text
  - Validate file type and size
- [ ] **API Integration**: 
  - Research and integrate Runway AI API or Leonardo AI API
  - Implement video/image transformation logic
  - Handle API polling/status checking
- [ ] **Output**: Return transformed video/image URL(s)
- [ ] **Error Handling**: Timeout handling, API error responses

### Service 3: Global Voice
- [ ] **Route**: `/generate/voice` (POST)
- [ ] **Input Handling**:
  - Accept video file upload
  - Accept target language selection
  - Optional: custom text script input
- [ ] **API Integration**:
  - Integrate HeyGen API or ElevenLabs API for voice cloning/translation
  - Integrate D-ID API or HeyGen for lip-sync video generation
  - Handle multi-step processing (voice translation → lip-sync)
- [ ] **Output**: Return translated video URL with lip-sync
- [ ] **Error Handling**: Handle longer processing times (90-180s), API failures

### Service 4: Instant Influencer
- [ ] **Route**: `/generate/influencer` (POST)
- [ ] **Input Handling**:
  - Accept image file upload
  - Accept style preference (corporate, creative, casual, formal)
  - Validate image quality and dimensions
- [ ] **API Integration**:
  - Extend existing Replicate API integration
  - Use Flux-dev model with professional headshot prompts
  - Generate multiple variations (3-5 headshots)
- [ ] **Output**: Return array of professional headshot image URLs
- [ ] **Error Handling**: Reuse existing Replicate error handling patterns

### Service 5: Viral Hook Gen
- [ ] **Route**: `/generate/hook` (POST)
- [ ] **Input Handling**:
  - Accept video description/topic text
  - Accept target platform selection (TikTok, Instagram Reels, YouTube Shorts)
  - Optional: tone/style preferences
- [ ] **API Integration**:
  - Extend existing OpenAI API integration
  - Use GPT-4o model (upgrade from GPT-4o-mini)
  - Create platform-specific prompts for each social media platform
  - Generate multiple caption variations (5-10 options)
- [ ] **Output**: Return JSON array of caption/hook variations + hashtag suggestions
- [ ] **Error Handling**: Fast response time, handle API rate limits

### Backend Architecture Updates
- [ ] **Route Organization**: 
  - Keep existing `/generate` route for Time Capsule
  - Add new routes: `/generate/cinematic`, `/generate/voice`, `/generate/influencer`, `/generate/hook`
- [ ] **API Key Management**:
  - Add new environment variables for new APIs (Runway, Leonardo, HeyGen, ElevenLabs, D-ID)
  - Update `.env.example` with new API key placeholders
- [ ] **Error Handling**:
  - Unified error response format across all routes
  - Service-specific error messages
  - Retry logic for external API calls
- [ ] **File Handling**:
  - Support video file uploads (in addition to images)
  - Increase file size limits for video files (up to 100MB)
  - Video format validation and conversion if needed

### API Integration Priority
1. **Priority 1**: Instant Influencer (uses existing Replicate/Flux-dev, fastest to implement)
2. **Priority 2**: Viral Hook Gen (uses existing OpenAI, just model upgrade)
3. **Priority 3**: The Cinematic Switch (new API, medium complexity)
4. **Priority 4**: Global Voice (most complex, multiple APIs, longest processing time)

### Testing Requirements
- [ ] Unit tests for each new route
- [ ] API integration tests (mock API responses)
- [ ] File upload validation tests
- [ ] Error handling tests
- [ ] End-to-end tests for each service workflow

## Key Decisions

### Why Flask Over Next.js?

**Decision**: Use Flask (Python backend) instead of Next.js (React/Node.js)

**Rationale**:
1. **Python Ecosystem**: Better integration with AI/ML libraries and APIs
2. **Simplicity**: Flask provides a lightweight, straightforward approach for this use case
3. **API Integration**: Python's `requests` library and OpenAI SDK are mature and well-documented
4. **File Handling**: Python's file I/O is robust for image processing workflows
5. **Development Speed**: Faster initial setup without build tools or complex configuration
6. **Server-Side Processing**: Better suited for handling file uploads and API orchestration
7. **Resource Efficiency**: Lower overhead compared to Node.js for this specific workload

**Trade-offs**:
- Less modern frontend framework (using vanilla JS instead of React)
- No server-side rendering benefits
- Simpler architecture suitable for MVP and small-scale deployment

### Why Direct HTTP Requests for Replicate?

**Decision**: Use direct HTTP requests (`requests` library) instead of Replicate Python SDK

**Rationale**:
1. **Control**: Direct HTTP requests provide fine-grained control over API calls
2. **Error Handling**: Easier to implement custom retry logic and error messages
3. **Dependencies**: Fewer dependencies to manage (just `requests` vs entire SDK)
4. **Transparency**: Clear visibility into what's being sent/received
5. **Flexibility**: Easier to switch between different API endpoints or versions
6. **Learning**: Better understanding of the API structure for debugging

**Trade-offs**:
- More boilerplate code for API calls
- Manual handling of authentication headers
- Need to implement polling logic manually

## To-Do List

### High Priority
- [ ] **Loading Spinner Enhancement**: Add percentage/progress indicator during image processing
- [ ] **Download Functionality**: Allow users to download their aged photo
- [ ] **Error Recovery**: Implement retry mechanism for failed API calls
- [ ] **Input Validation**: Client-side and server-side validation for images and text

### Medium Priority
- [ ] **Social Media Sharing**: Add share buttons for Twitter, Facebook, Instagram
- [ ] **Image Gallery**: Store and display previous generations (with user consent)
- [ ] **Letter Customization**: Options for letter tone (inspiring, reflective, motivational)
- [ ] **Multiple Age Options**: Allow users to choose different future years (2030, 2040, 2050)
- [ ] **Email Delivery**: Option to email results to user

### Low Priority
- [ ] **User Accounts**: Optional registration to save history
- [ ] **Batch Processing**: Process multiple photos at once
- [ ] **Video Aging**: Support for short video clips
- [ ] **Comparison View**: Side-by-side before/after comparison
- [ ] **Export Options**: PDF generation with photo and letter
- [ ] **Analytics**: Track usage patterns and popular features

### Technical Improvements
- [ ] **Caching**: Cache API responses for similar inputs
- [ ] **Rate Limiting**: Implement rate limiting to prevent abuse
- [ ] **Logging**: Add comprehensive logging for debugging
- [ ] **Testing**: Unit tests for API integration and error handling
- [ ] **Docker**: Containerize application for easy deployment
- [ ] **Environment Config**: Support for development/staging/production environments

### UI/UX Enhancements
- [ ] **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- [ ] **Internationalization**: Multi-language support
- [ ] **Theme Options**: Light mode option
- [ ] **Tutorial/Onboarding**: First-time user guide
- [ ] **Mobile App**: Consider React Native or Flutter mobile app

## Architecture Notes

### Current Flow
1. User uploads image → Frontend sends FormData to `/generate`
2. Flask saves image temporarily → Uploads to Replicate
3. Replicate processes image → Flask polls for completion
4. Flask calls OpenAI → Generates wisdom letter
5. Flask returns JSON → Frontend displays results
6. Temporary files cleaned up

### Future Considerations
- **Queue System**: For handling multiple concurrent requests (Redis/Celery)
- **CDN**: Serve static assets and cached images via CDN
- **Database**: Store user sessions and generation history
- **WebSockets**: Real-time progress updates instead of polling
- **Microservices**: Split image processing and letter generation into separate services

## Performance Targets

- **Image Upload**: < 2 seconds
- **Replicate Processing**: 30-60 seconds (external dependency)
- **OpenAI Generation**: < 5 seconds
- **Total Response Time**: < 70 seconds (acceptable for AI processing)
- **Page Load**: < 1 second

## Security Considerations

- ✅ Environment variables for API keys
- ✅ Secure filename handling
- ✅ File size limits
- ✅ CORS configuration
- [ ] Input sanitization for text inputs
- [ ] Rate limiting per IP
- [ ] HTTPS enforcement in production
- [ ] API key rotation strategy

## Deployment Checklist

- [ ] Production environment variables configured
- [ ] Error logging and monitoring (e.g., Sentry)
- [ ] Health check endpoint
- [ ] Production-grade WSGI server (Gunicorn/uWSGI)
- [ ] Reverse proxy setup (Nginx)
- [ ] SSL certificate configuration
- [ ] Database setup (if implementing user accounts)
- [ ] Backup strategy for user data

---

## Phase 2 (Legacy): Optimization & Enhancements (Deferred)

*Note: Original Phase 2 tasks have been deferred in favor of Multi-Service expansion. These can be addressed after Phase 3 completion.*

### Image Processing Optimization
- [ ] Implement image compression before upload to reduce processing time
- [ ] Add image validation (dimensions, aspect ratio, file type)
- [ ] Optimize Replicate API polling intervals
- [ ] Add progress indicators for multi-stage processing
- [ ] Implement retry logic for failed API calls

### Download Functionality
- [ ] Add "Download" button for aged photo
- [ ] Implement client-side image download via blob URLs
- [ ] Option to download wisdom letter as text file
- [ ] Shareable image format with watermark/branding option

### CSS Animations Refinement
- [ ] Enhanced loading spinner with progress percentage
- [ ] Smooth transitions between upload and results
- [ ] Parallax effects for depth
- [ ] Micro-interactions on buttons and cards
- [ ] Responsive animation adjustments for mobile

---

**See also**:
- [Master Documentation Index](docs/00-docs-index.md)
- [Glossary & Canonical Naming](docs/00-glossary.md)
- [Services Catalog](SERVICES.md)
- [Project Overview](docs/01-project-overview.md)
