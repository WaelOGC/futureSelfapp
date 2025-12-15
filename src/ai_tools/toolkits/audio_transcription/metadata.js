// Audio Transcription tool metadata

module.exports = {
  id: 'audio_transcription',
  name: 'Audio Transcription',
  description: 'Transcribe audio files to text using AI speech recognition',
  supportedTasks: ['AUDIO_TRANSCRIPTION'],
  defaultProvider: 'OPENAI',
  devSamplePayload: {
    audioUrl: 'https://example.com/audio.mp3',
    language: 'en'
  }
};
