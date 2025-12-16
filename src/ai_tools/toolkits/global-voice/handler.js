// Global Voice tool handler

const { AppError } = require('../../../core/errors/error.handler');
const { getProvider } = require('../../../ai/providers/provider.registry');
const { getEnv, ensureEnvLoaded } = require('../../../core/env/env.loader');

/**
 * Handle global-voice tool execution
 * Translates user videos into different languages while preserving voice characteristics and generating lip-sync video
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override
 * @param {string} params.identity - User identity
 * @returns {Promise<Object>} Result with translated_video_url, source_language, target_language, processing_time, video_metadata
 */
async function handle({ payload, providerOverride, identity }) {
  const startTime = Date.now();
  const provider = providerOverride || 'HEYGEN';
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  try {
    // Ensure environment is loaded
    ensureEnvLoaded({ override: true });

    // Extract and validate inputs
    const targetLanguageInput = payload.target_language.trim();
    const customScript = payload.custom_script && payload.custom_script.trim() ? payload.custom_script.trim() : null;
    const voicePreservation = payload.voice_preservation !== undefined ? payload.voice_preservation : 0.8;
    const videoQuality = payload.video_quality || '1080p';

    // Check for required API keys based on provider using centralized env loader
    if (provider === 'HEYGEN' || provider === 'GLOBAL_VOICE') {
      try {
        const heygenKey = getEnv('HEYGEN_API_KEY', { required: true });
        // Verify key is not empty after trimming
        if (!heygenKey || typeof heygenKey !== 'string' || heygenKey.trim().length === 0) {
          throw new Error('HEYGEN_API_KEY is empty or whitespace-only');
        }
      } catch (err) {
        process.stderr.write(`[GLOBAL_VOICE] [${requestId}] HEYGEN_API_KEY missing: ${err.message}\n`);
        throw new AppError(
          'HEYGEN_API_KEY is not loaded. Ensure .env exists at project root and contains HEYGEN_API_KEY.',
          500,
          'PROVIDER_KEY_MISSING',
          { service: 'global-voice', requestId }
        );
      }
    } else if (provider === 'ELEVENLABS') {
      // ElevenLabs integration not yet implemented
      throw new AppError(
        'ElevenLabs provider integration not yet implemented. Use HEYGEN provider.',
        501,
        'PROVIDER_NOT_IMPLEMENTED',
        { service: 'global-voice', requestId }
      );
    }

    // Only implement HeyGen for now
    if (provider !== 'HEYGEN' && provider !== 'GLOBAL_VOICE') {
      throw new AppError(
        `Provider '${provider}' not supported for VIDEO_TRANSLATION. Use HEYGEN.`,
        400,
        'INVALID_INPUT',
        { service: 'global-voice', requestId }
      );
    }

    process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Starting video translation to: ${targetLanguageInput}\n`);
    // Get HeyGen client
    const heygenClient = getProvider('HEYGEN');

    // Step 1: Decode base64 video to Buffer
    const videoDataUrl = payload.video;
    if (!videoDataUrl.startsWith('data:video/')) {
      throw new AppError(
        'video must be a valid base64 data URL (data:video/mp4;base64,...)',
        400,
        'INVALID_INPUT',
        { service: 'global-voice', requestId }
      );
    }

    // Extract mime type and base64 data
    const matches = videoDataUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new AppError(
        'Invalid video data URL format. Expected: data:video/mp4;base64,...',
        400,
        'INVALID_INPUT',
        { service: 'global-voice', requestId }
      );
    }

    const mimeType = `video/${matches[1]}`;
    const base64Data = matches[2];
    let videoBuffer;
    try {
      videoBuffer = Buffer.from(base64Data, 'base64');
    } catch (err) {
      throw new AppError(
        'Failed to decode base64 video data',
        400,
        'INVALID_INPUT',
        { service: 'global-voice', requestId, details: err.message }
      );
    }

    // Determine filename from mime type
    const extension = matches[1].toLowerCase();
    const filename = `video.${extension}`;

    // Step 2: Upload video to HeyGen
    process.stderr.write(`[GLOBAL_VOICE] Uploading video to HeyGen (${videoBuffer.length} bytes)...\n`);
    const uploadResult = await heygenClient.uploadAsset({
      buffer: videoBuffer,
      filename,
      mimeType
    });

    if (!uploadResult.url) {
      process.stderr.write(`[GLOBAL_VOICE] [${requestId}] HeyGen upload failed: No URL returned\n`);
      throw new AppError(
        'HeyGen upload failed: No URL returned',
        400,
        'PROVIDER_ERROR',
        { service: 'global-voice', requestId }
      );
    }

    const videoUrl = uploadResult.url;
    process.stderr.write(`[GLOBAL_VOICE] Video uploaded: ${videoUrl}\n`);

    // Step 3: Map target language to HeyGen format
    process.stderr.write(`[GLOBAL_VOICE] Resolving target language: ${targetLanguageInput}\n`);
    const supportedLanguages = await heygenClient.listTargetLanguages();
    
    // Try to find matching language
    let resolvedLanguage = null;
    const targetLower = targetLanguageInput.toLowerCase();
    
    // First try exact match on code
    for (const lang of supportedLanguages) {
      if (lang.code && lang.code.toLowerCase() === targetLower) {
        resolvedLanguage = lang.name;
        break;
      }
    }
    
    // If not found, try name match
    if (!resolvedLanguage) {
      for (const lang of supportedLanguages) {
        if (lang.name && lang.name.toLowerCase() === targetLower) {
          resolvedLanguage = lang.name;
          break;
        }
      }
    }

    // If still not found, try partial match
    if (!resolvedLanguage) {
      for (const lang of supportedLanguages) {
        if (lang.name && lang.name.toLowerCase().includes(targetLower)) {
          resolvedLanguage = lang.name;
          break;
        }
      }
    }

    if (!resolvedLanguage) {
      const supportedNames = supportedLanguages
        .map(l => l.name || l.code)
        .filter(Boolean)
        .slice(0, 10)
        .join(', ');
      process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Unsupported language: ${targetLanguageInput}\n`);
      throw new AppError(
        `Unsupported target language: ${targetLanguageInput}. Supported languages: ${supportedNames}${supportedLanguages.length > 10 ? '...' : ''}`,
        400,
        'INVALID_INPUT',
        { 
          service: 'global-voice',
          requestId,
          supportedLanguages: supportedLanguages.map(l => l.name || l.code).filter(Boolean) 
        }
      );
    }

    process.stderr.write(`[GLOBAL_VOICE] Resolved language: ${resolvedLanguage}\n`);

    // Step 4: Start translation
    const title = customScript ? 'FutureSelfApp Global Voice (Custom Script)' : 'FutureSelfApp Global Voice';
    process.stderr.write(`[GLOBAL_VOICE] Starting translation to ${resolvedLanguage}...\n`);
    
    const translateResult = await heygenClient.translateVideo({
      videoUrl,
      outputLanguages: [resolvedLanguage],
      title
    });

    const videoTranslateId = translateResult.video_translate_id || 
                             (translateResult.video_translate_ids && translateResult.video_translate_ids[0]) ||
                             translateResult.id;

    if (!videoTranslateId) {
      process.stderr.write(`[GLOBAL_VOICE] [${requestId}] HeyGen translation failed: No translation ID returned\n`);
      throw new AppError(
        'HeyGen translation failed: No translation ID returned',
        400,
        'PROVIDER_ERROR',
        { service: 'global-voice', requestId }
      );
    }

    process.stderr.write(`[GLOBAL_VOICE] Translation started: ${videoTranslateId}\n`);

    // Step 5: Poll for status (max 180 seconds, check every 3 seconds)
    const maxWaitTime = 180000; // 180 seconds
    const pollInterval = 3000; // 3 seconds
    const maxPolls = Math.floor(maxWaitTime / pollInterval);
    let translatedVideoUrl = null;
    let finalStatus = null;

    for (let i = 0; i < maxPolls; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusResult = await heygenClient.getTranslationStatus({ videoTranslateId });
      finalStatus = statusResult.status;

      process.stderr.write(`[GLOBAL_VOICE] Status check ${i + 1}/${maxPolls}: ${finalStatus}\n`);

      if (finalStatus === 'completed' || finalStatus === 'succeeded' || finalStatus === 'success') {
        translatedVideoUrl = statusResult.url;
        if (translatedVideoUrl) {
          break;
        }
      }

      if (finalStatus === 'failed' || finalStatus === 'error') {
        process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Translation failed: ${statusResult.error || 'Unknown error'}\n`);
        throw new AppError(
          `HeyGen translation failed: ${statusResult.error || 'Unknown error'}`,
          400,
          'PROVIDER_ERROR',
          { 
            service: 'global-voice',
            code: 'PROVIDER_ERROR',
            message: statusResult.error || 'Unknown error',
            details: statusResult.raw,
            requestId
          }
        );
      }
    }

    if (!translatedVideoUrl) {
      process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Translation timeout: Status '${finalStatus}' after ${maxWaitTime / 1000}s\n`);
      throw new AppError(
        `Translation timeout: Status is '${finalStatus}' after ${maxWaitTime / 1000} seconds`,
        504,
        'TIMEOUT',
        { 
          service: 'global-voice',
          requestId,
          videoTranslateId, 
          finalStatus 
        }
      );
    }

    process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Translation completed: ${translatedVideoUrl}\n`);

    // Calculate processing time
    const processingTime = (Date.now() - startTime) / 1000;

    // Return result per spec
    return {
      translated_video_url: translatedVideoUrl,
      source_language: 'en', // Default to English (HeyGen auto-detects)
      target_language: targetLanguageInput,
      processing_time: processingTime,
      provider_job_id: videoTranslateId,
      model_used: 'HEYGEN',
      video_metadata: {
        duration: null, // Would need to extract from video
        resolution: videoQuality === '1080p' ? '1920x1080' : videoQuality === '720p' ? '1280x720' : '3840x2160',
        format: 'mp4'
      }
    };
  } catch (err) {
    // Re-throw AppErrors as-is (already normalized)
    if (err instanceof AppError) {
      process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Error: ${err.code} - ${err.message}\n`);
      throw err;
    }
    // Wrap other errors with normalized format
    process.stderr.write(`[GLOBAL_VOICE] [${requestId}] Unexpected error: ${err.message}\n`);
    throw new AppError(
      `Video translation failed: ${err.message}`,
      500,
      'AI_TASK_FAILED',
      { 
        service: 'global-voice',
        code: 'AI_TASK_FAILED',
        message: err.message,
        details: err.message,
        requestId,
        provider, 
        task: 'VIDEO_TRANSLATION'
      }
    );
  }
}

module.exports = {
  handle
};
