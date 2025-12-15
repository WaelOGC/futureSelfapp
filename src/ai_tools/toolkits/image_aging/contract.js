// Image Aging tool contract - payload and output shape definitions

/**
 * Input Payload Contract:
 * {
 *   imageUrl: string (optional) - URL of the image to age/edit
 *   imageBase64: string (optional) - Base64 encoded image data
 *   prompt: string (optional) - Description of the aging/transformation desired
 * }
 * 
 * Note: Either imageUrl OR imageBase64 must be provided
 * 
 * Output Contract:
 * string - URL or base64 data of the aged/transformed image
 */

const PAYLOAD_SCHEMA = {
  imageUrl: { type: 'string', required: false },
  imageBase64: { type: 'string', required: false },
  prompt: { type: 'string', required: false }
};

const OUTPUT_SCHEMA = {
  type: 'string',
  description: 'URL or base64 data of the transformed image'
};

module.exports = {
  PAYLOAD_SCHEMA,
  OUTPUT_SCHEMA
};
