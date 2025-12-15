// Image Variation tool metadata

module.exports = {
  id: 'image_variation',
  name: 'Image Variation',
  description: 'Generate variations of images using AI image generation',
  supportedTasks: ['IMAGE_GENERATION'],
  defaultProvider: 'OPENAI',
  devSamplePayload: {
    prompt: 'A beautiful sunset over mountains',
    size: '1024x1024'
  }
};
