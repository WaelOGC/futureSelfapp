// Audio Transcription tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate audio_transcription tool payload
 * @param {Object} payload - Payload to validate
 * @throws {AppError} If validation fails
 */
function validate(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  if (!payload.audioUrl || typeof payload.audioUrl !== 'string' || payload.audioUrl.trim().length === 0) {
    throw new AppError('audioUrl is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  if (payload.language !== undefined && (typeof payload.language !== 'string' || payload.language.trim().length === 0)) {
    throw new AppError('language must be a non-empty string if provided', 400, 'INVALID_INPUT');
  }
}

module.exports = {
  validate
};
