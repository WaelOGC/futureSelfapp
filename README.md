**Title**: README  
**Status**: Draft  
**Version**: 1.0  
**Owner**: FutureSelfApp Team  
**Last Updated**: 2024-12-19  
**Applies To**: Platform

---

# FutureSelfApp

## Overview

**FutureSelfApp** is a web application that combines AI-powered image aging with personalized wisdom letter generation. Users upload a photo of themselves and share their dreams, and the app generates:

- **Aged Selfie**: A realistic AI-generated image showing how they would look in 2050, created using advanced image processing models
- **Wisdom Letter**: A personalized 100-word letter from their "future self" offering guidance and reflection based on their dreams

The app provides an inspiring, reflective experience that helps users visualize their future and receive meaningful AI-generated wisdom.

## Tech Stack

- **Backend**: Python 3, Flask (web framework)
- **AI Services**:
  - **OpenAI GPT-4o-mini**: Generates personalized wisdom letters
  - **Replicate (Flux-dev)**: Processes and ages user photos using advanced image generation models
- **Frontend**: Vanilla JavaScript, CSS3 (no frameworks)
- **Additional Libraries**:
  - `flask-cors`: Enables cross-origin resource sharing
  - `python-dotenv`: Manages environment variables securely
  - `werkzeug`: Handles file uploads and security
  - `requests`: Makes HTTP requests to Replicate API

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- API keys for OpenAI and Replicate

### Step 1: Install Dependencies

Navigate to the project directory and install required packages:

```bash
pip install -r requirements.txt
```

Or install individually:

```bash
pip install flask flask-cors openai python-dotenv werkzeug requests
```

### Step 2: Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```
   On Windows:
   ```bash
   copy .env.example .env
   ```

2. **Add your API keys to `.env`:**
   - Open the `.env` file in a text editor
   - Replace `your_replicate_api_token_here` with your actual Replicate API token
   - Replace `your_openai_api_key_here` with your actual OpenAI API key

   **Getting API Keys:**
   - **Replicate API Token**: Visit https://replicate.com/account/api-tokens
   - **OpenAI API Key**: Visit https://platform.openai.com/api-keys

   **Important Security Notes:**
   - Never commit the `.env` file to version control (it's already in `.gitignore`)
   - Do not include quotes around the values in `.env`
   - Keep your API keys secure and private

### Step 3: Run the Application

Start the Flask development server:

```bash
python app.py
```

Or on Windows:

```bash
py app.py
```

The application will start on `http://localhost:5000`.

### Step 4: Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

## Project Structure

```
futureSelfapp/
├── app.py                 # Flask backend server with routes and AI integration
├── templates/
│   └── index.html        # Frontend UI (HTML, CSS, JavaScript)
├── uploads/              # Temporary directory for image processing (auto-created)
├── .env                  # Environment variables (API keys) - NOT in version control
├── .gitignore           # Git ignore rules
├── requirements.txt      # Python dependencies list
├── README.md            # Project documentation (this file)
└── PLAN.md              # Technical roadmap and development plan
```

## Usage

1. **Upload Photo**: Click or drag-and-drop a photo of yourself in the upload area
2. **Enter Dream**: Type your biggest dream or aspiration in the text area
3. **Generate**: Click the "Go to 2050" button
4. **Wait**: The AI processing typically takes 30-60 seconds
5. **View Results**: See your aged photo and read your personalized wisdom letter

## Features

- 📸 **AI-Powered Photo Aging**: Realistic transformation to show how you'll look in 2050
- 💭 **Personalized Wisdom Letters**: AI-generated 100-word letters based on your dreams
- 🎨 **Modern UI**: Dark-themed interface with smooth animations
- ⚡ **Real-time Processing**: Asynchronous API calls without page refresh
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Secure File Handling**: Temporary file storage with automatic cleanup

## Notes

- First request may take longer as AI models initialize
- Image processing typically takes 30-60 seconds
- Uploaded images are temporarily stored and automatically deleted after processing
- Maximum file size: 16MB
- Supported image formats: JPG, PNG, GIF, and other common formats

## Troubleshooting

### Import Errors
```bash
pip install -r requirements.txt
```

### API Errors
- Verify your API keys are correctly set in the `.env` file
- Check that the keys are active and have sufficient credits/quota
- Ensure no extra spaces or quotes around the values in `.env`

### Image Upload Fails
- Check that the image is under 16MB
- Verify the image format is supported (JPG, PNG, etc.)
- Ensure the `uploads/` directory has write permissions

### Server Won't Start
- Verify Python 3.7+ is installed: `python --version`
- Check that port 5000 is not already in use
- Review console output for specific error messages

## License

This project is open source and available for personal and educational use.

---

**See also**:
- [Master Documentation Index](docs/00-docs-index.md)
- [Glossary & Canonical Naming](docs/00-glossary.md)
- [Project Overview](docs/01-project-overview.md)
- [Technical Roadmap](PLAN.md)
