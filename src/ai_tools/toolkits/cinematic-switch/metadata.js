// Cinematic Switch tool metadata

module.exports = {
  id: 'cinematic-switch',
  name: 'The Cinematic Switch',
  description: 'AI-powered visual transformation service that transforms user photos or videos into different scenes, characters, styles, or settings while maintaining recognizable features',
  supportedTasks: ['CINEMATIC_SWITCH_GENERATION'],
  defaultProvider: 'REPLICATE',
  devSamplePayload: {
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...', // base64 encoded image
    scene_description: 'Transform this person into a medieval knight in a castle setting, wearing armor and holding a sword.'
  }
};
