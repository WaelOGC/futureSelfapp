// Future Letter tool contract - payload and output shape definitions

/**
 * Input Payload Contract:
 * {
 *   prompt: string (required) - The main prompt/instruction for letter generation
 *   system: string (optional) - System message to guide the AI's behavior
 *   model: string (optional) - Model identifier (defaults to provider default)
 * }
 * 
 * Output Contract:
 * string - Generated letter text
 */

const PAYLOAD_SCHEMA = {
  prompt: { type: 'string', required: true },
  system: { type: 'string', required: false },
  model: { type: 'string', required: false }
};

const OUTPUT_SCHEMA = {
  type: 'string',
  description: 'Generated letter text content'
};

module.exports = {
  PAYLOAD_SCHEMA,
  OUTPUT_SCHEMA
};
