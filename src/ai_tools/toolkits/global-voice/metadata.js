// Global Voice tool metadata

module.exports = {
  id: 'global-voice',
  name: 'Global Voice',
  description: 'AI-powered multilingual video translation service that translates user videos into different languages while preserving original voice characteristics and generating accurate lip-sync video output',
  supportedTasks: ['VIDEO_TRANSLATION'],
  defaultProvider: 'HEYGEN',
  devSamplePayload: {
    video: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAA...', // base64 encoded video
    target_language: 'es',
    custom_script: null,
    voice_preservation: 0.8,
    video_quality: '1080p'
  }
};
