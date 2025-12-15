// Image Aging tool metadata

module.exports = {
  id: 'image_aging',
  name: 'Image Aging',
  description: 'Age or transform images using AI image editing or generation',
  supportedTasks: ['IMAGE_EDIT', 'IMAGE_GENERATION'],
  defaultProvider: 'OPENAI',
  devSamplePayload: {
    imageUrl: 'https://example.com/photo.jpg',
    prompt: 'Age this person by 20 years'
  }
};
