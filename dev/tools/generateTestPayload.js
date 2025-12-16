#!/usr/bin/env node
// Dev-only helper to generate test payloads for AI Dev Dashboard
// Usage:
//   node dev/tools/generateTestPayload.js cinematic dev/assets/test-face.jpg
//   node dev/tools/generateTestPayload.js influencer dev/assets/test-face.jpg
//   node dev/tools/generateTestPayload.js video dev/assets/sample-video.mp4

const fs = require('fs');
const path = require('path');

// Get command line arguments
const [,, mode, filePath] = process.argv;

// Validate arguments
if (!mode || !filePath) {
  console.error('Usage: node dev/tools/generateTestPayload.js <mode> <file-path>');
  console.error('');
  console.error('Modes:');
  console.error('  cinematic  - Generate payload for Cinematic Switch (image)');
  console.error('  influencer - Generate payload for Instant Influencer (image)');
  console.error('  video      - Generate payload for Video Translation (video)');
  process.exit(1);
}

// Validate mode
const validModes = ['cinematic', 'influencer', 'video'];
if (!validModes.includes(mode)) {
  console.error(`Error: Invalid mode "${mode}"`);
  console.error(`Valid modes: ${validModes.join(', ')}`);
  process.exit(1);
}

// Resolve file path
const resolvedPath = path.resolve(filePath);

// Check if file exists
if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: File not found: ${resolvedPath}`);
  process.exit(1);
}

// Read file and convert to base64
let fileBuffer;
try {
  fileBuffer = fs.readFileSync(resolvedPath);
} catch (err) {
  console.error(`Error reading file: ${err.message}`);
  process.exit(1);
}

// Determine MIME type based on file extension
const ext = path.extname(resolvedPath).toLowerCase();
let mimeType;

if (mode === 'video') {
  // Video mode
  if (['.mp4'].includes(ext)) {
    mimeType = 'video/mp4';
  } else if (['.mov'].includes(ext)) {
    mimeType = 'video/mov';
  } else if (['.avi'].includes(ext)) {
    mimeType = 'video/avi';
  } else {
    console.error(`Error: Unsupported video format. Supported: .mp4, .mov, .avi`);
    process.exit(1);
  }
} else {
  // Image mode (cinematic or influencer)
  if (['.jpg', '.jpeg'].includes(ext)) {
    mimeType = 'image/jpeg';
  } else if (['.png'].includes(ext)) {
    mimeType = 'image/png';
  } else {
    console.error(`Error: Unsupported image format. Supported: .jpg, .jpeg, .png`);
    process.exit(1);
  }
}

// Convert to base64 data URL
const base64Data = fileBuffer.toString('base64');
const dataUrl = `data:${mimeType};base64,${base64Data}`;

// Generate payload based on mode
let payload;

if (mode === 'cinematic') {
  // Cinematic Switch payload
  payload = {
    image: dataUrl,
    scene_description: 'Transform this person into a futuristic cyberpunk hero.',
    aspect_ratio: '16:9',
    output_count: 1
  };
} else if (mode === 'influencer') {
  // Instant Influencer payload
  payload = {
    image: dataUrl,
    style: 'corporate',
    variation_count: 3
  };
} else if (mode === 'video') {
  // Video Translation payload
  payload = {
    video: dataUrl,
    target_language: 'es',
    voice_preservation: 0.8,
    video_quality: '1080p'
  };
}

// Print JSON payload to console
console.log(JSON.stringify(payload, null, 2));

