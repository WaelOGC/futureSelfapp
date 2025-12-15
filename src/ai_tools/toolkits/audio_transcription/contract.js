// Audio Transcription tool contract - payload and output shape definitions

/**
 * Input Payload Contract:
 * {
 *   audioUrl: string (required) - URL of the audio file to transcribe
 *   language: string (optional) - Language code (e.g., "en", "es", "fr")
 * }
 * 
 * Output Contract:
 * string - Transcribed text
 */

const PAYLOAD_SCHEMA = {
  audioUrl: { type: 'string', required: true },
  language: { type: 'string', required: false }
};

const OUTPUT_SCHEMA = {
  type: 'string',
  description: 'Transcribed text content'
};

module.exports = {
  PAYLOAD_SCHEMA,
  OUTPUT_SCHEMA
};
