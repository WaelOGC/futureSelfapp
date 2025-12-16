// Instant Influencer tool metadata

module.exports = {
  id: 'instant-influencer',
  name: 'Instant Influencer',
  description: 'AI-powered professional headshot generation service that creates studio-quality professional photos from user-uploaded images in multiple style variations',
  supportedTasks: ['INSTANT_INFLUENCER_GENERATION'],
  defaultProvider: 'REPLICATE',
  devSamplePayload: {
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...', // base64 encoded image
    style: 'corporate',
    variation_count: 3
  }
};
