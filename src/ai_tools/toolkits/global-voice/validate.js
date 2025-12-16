// Global Voice tool validation

const { AppError } = require('../../../core/errors/error.handler');

// Supported language codes (ISO 639-1)
const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'ja', 'zh', 'it', 'pt', 'ko', 'ar', 'hi', 'ru', 'nl', 'pl', 'tr'
];

// Supported video quality options
const SUPPORTED_QUALITIES = ['720p', '1080p', '4k'];

/**
 * Validate global-voice tool payload
 * @param {Object} payload - Payload to validate
 * @throws {AppError} If validation fails
 */
function validate(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  // Validate video
  if (!payload.video || typeof payload.video !== 'string' || payload.video.trim().length === 0) {
    throw new AppError('video is required and must be a non-empty string (base64 data URL)', 400, 'INVALID_INPUT');
  }

  // Validate video format (must be data URL)
  if (!payload.video.startsWith('data:video/')) {
    throw new AppError('video must be a valid base64 data URL (data:video/mp4;base64,... or data:video/mov;base64,... or data:video/avi;base64,...)', 400, 'INVALID_INPUT');
  }

  // Validate video format (MP4, MOV, or AVI)
  const videoFormat = payload.video.match(/data:video\/([^;]+)/);
  if (!videoFormat || !['mp4', 'mov', 'avi'].includes(videoFormat[1].toLowerCase())) {
    throw new AppError('video format must be MP4, MOV, or AVI', 400, 'INVALID_INPUT');
  }

  // Validate target_language
  if (!payload.target_language || typeof payload.target_language !== 'string') {
    throw new AppError('target_language is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  const targetLanguage = payload.target_language.trim().toLowerCase();
  if (targetLanguage.length === 0) {
    throw new AppError('target_language cannot be empty or whitespace only', 400, 'INVALID_INPUT');
  }

  if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
    throw new AppError(
      `target_language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
      400,
      'INVALID_INPUT'
    );
  }

  // Validate optional custom_script
  if (payload.custom_script !== undefined && payload.custom_script !== null) {
    if (typeof payload.custom_script !== 'string') {
      throw new AppError('custom_script must be a string or null', 400, 'INVALID_INPUT');
    }
    // Allow empty string for custom_script (treated as null)
  }

  // Validate optional voice_preservation
  if (payload.voice_preservation !== undefined) {
    if (typeof payload.voice_preservation !== 'number') {
      throw new AppError('voice_preservation must be a number', 400, 'INVALID_INPUT');
    }
    if (payload.voice_preservation < 0.0 || payload.voice_preservation > 1.0) {
      throw new AppError('voice_preservation must be between 0.0 and 1.0 (inclusive)', 400, 'INVALID_INPUT');
    }
  }

  // Validate optional video_quality
  if (payload.video_quality !== undefined) {
    if (typeof payload.video_quality !== 'string') {
      throw new AppError('video_quality must be a string', 400, 'INVALID_INPUT');
    }
    if (!SUPPORTED_QUALITIES.includes(payload.video_quality.toLowerCase())) {
      throw new AppError(
        `video_quality must be one of: ${SUPPORTED_QUALITIES.join(', ')}`,
        400,
        'INVALID_INPUT'
      );
    }
  }
}

module.exports = {
  validate
};
