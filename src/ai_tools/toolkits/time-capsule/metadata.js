// Time Capsule tool metadata

module.exports = {
  id: 'time-capsule',
  name: 'The Time Capsule',
  description: 'AI-powered photo aging service that generates a realistic aged self-portrait and a personalized wisdom letter from your future self',
  supportedTasks: ['TIME_CAPSULE_GENERATION'],
  defaultProvider: 'OPENAI',
  devSamplePayload: {
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...', // base64 encoded image
    dream: 'I want to start my own sustainable business and make a positive impact on the environment.'
  }
};
