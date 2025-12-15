// Image Aging tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate image_aging tool payload
 * @param {Object} payload - Payload to validate
 * @throws {AppError} If validation fails
 */
function validate(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  const hasImageUrl = payload.imageUrl && typeof payload.imageUrl === 'string' && payload.imageUrl.trim().length > 0;
  const hasImageBase64 = payload.imageBase64 && typeof payload.imageBase64 === 'string' && payload.imageBase64.trim().length > 0;

  if (!hasImageUrl && !hasImageBase64) {
    throw new AppError('Either imageUrl or imageBase64 must be provided', 400, 'INVALID_INPUT');
  }

  if (payload.prompt !== undefined && (typeof payload.prompt !== 'string' || payload.prompt.trim().length === 0)) {
    throw new AppError('prompt must be a non-empty string if provided', 400, 'INVALID_INPUT');
  }
}

module.exports = {
  validate
};
