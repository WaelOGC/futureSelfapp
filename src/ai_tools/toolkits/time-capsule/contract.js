// Time Capsule tool contract - payload and output shape definitions

/**
 * Input Payload Contract:
 * {
 *   image: string (required) - Base64 encoded image data URL (data:image/jpeg;base64,... or data:image/png;base64,...)
 *   dream: string (required) - User's dream or aspiration text (10-2000 characters)
 * }
 * 
 * Output Contract:
 * {
 *   aged_image_url: string - Public URL to the aged photo image
 *   wisdom_letter: string - Complete wisdom letter text (100-150 words)
 *   word_count: number - Actual word count of generated letter
 *   processing_time: number - Time taken for processing in seconds
 * }
 */

const PAYLOAD_SCHEMA = {
  image: { type: 'string', required: true },
  dream: { type: 'string', required: true }
};

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    aged_image_url: { type: 'string' },
    wisdom_letter: { type: 'string' },
    word_count: { type: 'number' },
    processing_time: { type: 'number' }
  }
};

module.exports = {
  PAYLOAD_SCHEMA,
  OUTPUT_SCHEMA
};
