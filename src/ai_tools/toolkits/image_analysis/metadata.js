// Image Analysis tool metadata

module.exports = {
  id: 'image_analysis',
  name: 'Image Analysis',
  description: 'Analyze images and extract information using AI vision capabilities',
  supportedTasks: ['IMAGE_ANALYSIS'],
  defaultProvider: 'OPENAI',
  devSamplePayload: {
    imageUrl: 'https://example.com/image.jpg',
    question: 'What is in this image?'
  }
};
