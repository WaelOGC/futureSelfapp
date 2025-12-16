// AI provider interface contracts and abstractions

/**
 * AI Task Types
 * 
 * Contract: All AI providers must implement handlers for these tasks.
 * Each task maps to a specific provider method:
 * - TEXT_GENERATION -> generateText(payload)
 * - IMAGE_GENERATION -> generateImage(payload)
 * - IMAGE_EDIT -> editImage(payload)
 * - IMAGE_ANALYSIS -> analyzeImage(payload)
 * - AUDIO_TRANSCRIPTION -> transcribeAudio(payload)
 */
const AI_TASKS = {
  TEXT_GENERATION: 'TEXT_GENERATION',
  IMAGE_GENERATION: 'IMAGE_GENERATION',
  IMAGE_EDIT: 'IMAGE_EDIT',
  IMAGE_ANALYSIS: 'IMAGE_ANALYSIS',
  AUDIO_TRANSCRIPTION: 'AUDIO_TRANSCRIPTION',
  TIME_CAPSULE_GENERATION: 'TIME_CAPSULE_GENERATION',
  CINEMATIC_SWITCH_GENERATION: 'CINEMATIC_SWITCH_GENERATION',
  VIDEO_TRANSLATION: 'VIDEO_TRANSLATION',
  INSTANT_INFLUENCER_GENERATION: 'INSTANT_INFLUENCER_GENERATION'
};

/**
 * AI Provider Names
 */
const PROVIDERS = {
  OPENAI: 'OPENAI',
  GEMINI: 'GEMINI',
  ANTHROPIC: 'ANTHROPIC'
};

module.exports = {
  AI_TASKS,
  PROVIDERS
};
