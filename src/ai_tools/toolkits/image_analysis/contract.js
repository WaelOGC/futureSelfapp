// Image Analysis tool contract - payload and output shape definitions

/**
 * Input Payload Contract:
 * {
 *   imageUrl: string (required) - URL of the image to analyze
 *   question: string (optional) - Specific question about the image (defaults to "Describe this image.")
 * }
 * 
 * Output Contract:
 * string - Analysis result text
 */

const PAYLOAD_SCHEMA = {
  imageUrl: { type: 'string', required: true },
  question: { type: 'string', required: false }
};

const OUTPUT_SCHEMA = {
  type: 'string',
  description: 'Analysis result text'
};

module.exports = {
  PAYLOAD_SCHEMA,
  OUTPUT_SCHEMA
};
