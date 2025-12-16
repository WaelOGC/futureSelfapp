// Cinematic Switch tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate cinematic-switch tool payload
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

  // Validate scene_description text
  if (!payload.scene_description || typeof payload.scene_description !== 'string') {
    throw new AppError('scene_description is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  const sceneDescriptionTrimmed = payload.scene_description.trim();
  if (sceneDescriptionTrimmed.length === 0) {
    throw new AppError('scene_description cannot be empty or whitespace only', 400, 'INVALID_INPUT');
  }

  if (sceneDescriptionTrimmed.length < 10) {
    throw new AppError('scene_description must be at least 10 characters', 400, 'INVALID_INPUT');
  }

  if (sceneDescriptionTrimmed.length > 2000) {
    throw new AppError('scene_description must not exceed 2000 characters', 400, 'INVALID_INPUT');
  }

  // Validate optional fields if provided
  if (payload.output_count !== undefined) {
    if (typeof payload.output_count !== 'number' || payload.output_count < 1 || payload.output_count > 5) {
      throw new AppError('output_count must be a number between 1 and 5', 400, 'INVALID_INPUT');
    }
  }

  if (payload.aspect_ratio !== undefined && payload.aspect_ratio !== 'original') {
    const validAspectRatios = ['16:9', '1:1', '9:16', '4:3', '3:4'];
    if (!validAspectRatios.includes(payload.aspect_ratio)) {
      throw new AppError(`aspect_ratio must be one of: ${validAspectRatios.join(', ')}, or 'original'`, 400, 'INVALID_INPUT');
    }
  }
}

module.exports = {
  validate
};
