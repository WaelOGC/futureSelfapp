// Future Letter tool metadata

module.exports = {
  id: 'future_letter',
  name: 'Future Letter',
  description: 'Generate personalized letters to your future self using AI text generation',
  supportedTasks: ['TEXT_GENERATION'],
  defaultProvider: 'OPENAI',
  devSamplePayload: {
    prompt: 'Write a letter to my future self about my goals and dreams.',
    system: 'You are a thoughtful and inspiring assistant that helps people write meaningful letters to their future selves.',
    model: 'gpt-4o-mini'
  }
};
