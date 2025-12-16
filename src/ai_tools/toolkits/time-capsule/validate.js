// Time Capsule tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate time-capsule tool payload
 * @param {Object} payload - Payload to validate
 * @throws {AppError} If validation fails
 */
function validate(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  // Validate image
  if (!payload.image || typeof payload.image !== 'string' || payload.image.trim().length === 0) {
    throw new AppError('image is required and must be a non-empty string (base64 data URL)', 400, 'INVALID_INPUT');
  }

  // Validate image format (must be data URL)
  if (!payload.image.startsWith('data:image/')) {
    throw new AppError('image must be a valid base64 data URL (data:image/jpeg;base64,... or data:image/png;base64,...)', 400, 'INVALID_INPUT');
  }

  // Validate dream text
  if (!payload.dream || typeof payload.dream !== 'string') {
    throw new AppError('dream is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  const dreamTrimmed = payload.dream.trim();
  if (dreamTrimmed.length === 0) {
    throw new AppError('dream text cannot be empty or whitespace only', 400, 'INVALID_INPUT');
  }

  if (dreamTrimmed.length < 10) {
    throw new AppError('dream text must be at least 10 characters', 400, 'INVALID_INPUT');
  }

  if (dreamTrimmed.length > 2000) {
    throw new AppError('dream text must not exceed 2000 characters', 400, 'INVALID_INPUT');
  }
}

module.exports = {
  validate
};
