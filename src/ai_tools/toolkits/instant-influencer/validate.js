// Instant Influencer tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate instant-influencer tool payload
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

  // Validate image MIME type (must be jpeg or png)
  const imageMimeMatch = payload.image.match(/^data:image\/(jpeg|jpg|png);base64,/i);
  if (!imageMimeMatch) {
    throw new AppError('image must be a JPEG or PNG image (data:image/jpeg;base64,... or data:image/png;base64,...)', 400, 'INVALID_INPUT');
  }

  // Validate style
  if (!payload.style || typeof payload.style !== 'string') {
    throw new AppError('style is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  const styleTrimmed = payload.style.trim().toLowerCase();
  const validStyles = ['corporate', 'creative', 'casual', 'formal'];
  if (!validStyles.includes(styleTrimmed)) {
    throw new AppError(`style must be one of: ${validStyles.join(', ')}`, 400, 'INVALID_INPUT');
  }

  // Validate variation_count if provided
  if (payload.variation_count !== undefined) {
    if (typeof payload.variation_count !== 'number' || !Number.isInteger(payload.variation_count)) {
      throw new AppError('variation_count must be an integer', 400, 'INVALID_INPUT');
    }

    if (payload.variation_count < 3) {
      throw new AppError('variation_count must be at least 3', 400, 'INVALID_INPUT');
    }

    if (payload.variation_count > 5) {
      throw new AppError('variation_count must not exceed 5', 400, 'INVALID_INPUT');
    }
  }
}

module.exports = {
  validate
};
