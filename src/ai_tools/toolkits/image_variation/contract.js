// Image Variation tool contract - payload and output shape definitions

/**
 * Input Payload Contract:
 * {
 *   prompt: string (required) - Description of the image to generate
 *   size: string (optional) - Image dimensions (e.g., "1024x1024")
 * }
 * 
 * Output Contract:
 * string - URL or base64 data of the generated image
 */

const PAYLOAD_SCHEMA = {
  prompt: { type: 'string', required: true },
  size: { type: 'string', required: false }
};

const OUTPUT_SCHEMA = {
  type: 'string',
  description: 'URL or base64 data of the generated image'
};

module.exports = {
  PAYLOAD_SCHEMA,
  OUTPUT_SCHEMA
};
