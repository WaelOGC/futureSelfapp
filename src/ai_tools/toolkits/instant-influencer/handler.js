// Instant Influencer tool handler

const { AppError } = require('../../../core/errors/error.handler');
const { getEnv } = require('../../../core/env/env.loader');

/**
 * Handle instant-influencer tool execution
 * Generates professional headshots using Replicate API
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override
 * @param {string} params.identity - User identity
 * @returns {Promise<Object>} Result with headshot_urls array, style_applied, processing_time, num_generated
 */
async function handle({ payload, providerOverride, identity }) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  try {
    // Validate Replicate API token using centralized env loader
    let replicateToken;
    try {
      replicateToken = getEnv('REPLICATE_API_TOKEN', { required: true });
    } catch (err) {
      process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] REPLICATE_API_TOKEN missing: ${err.message}\n`);
      throw new AppError(
        'REPLICATE_API_TOKEN is not loaded. Ensure .env exists at project root and contains REPLICATE_API_TOKEN.',
        500,
        'REPLICATE_KEY_MISSING',
        { service: 'instant-influencer', requestId }
      );
    }

    // Extract and normalize inputs
    const imageDataUrl = payload.image;
    const style = payload.style.trim().toLowerCase();
    const variationCount = payload.variation_count || 3;

    // Build style-specific prompt descriptors
    const styleDescriptors = {
      corporate: 'corporate, business professional, formal attire, executive',
      creative: 'creative, artistic, modern, contemporary',
      casual: 'casual, relaxed, friendly, approachable',
      formal: 'formal, elegant, sophisticated, traditional'
    };

    const styleDescriptor = styleDescriptors[style] || styleDescriptors.corporate;
    const prompt = `Professional headshot, ${styleDescriptor} style, studio lighting, clean background, high quality, 4K resolution, professional photography, business portrait, maintaining recognizable facial features`;

    process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Starting headshot generation: style=${style}, variations=${variationCount}\n`);

    // Call Replicate API for each variation (sequential to avoid rate limits)
    const https = require('https');
    const url = require('url');
    const replicateUrl = url.parse('https://api.replicate.com/v1/predictions');
    
    const headshotUrls = [];
    const errors = [];

  for (let i = 0; i < variationCount; i++) {
    try {
      const postData = JSON.stringify({
        version: 'black-forest-labs/flux-dev',
        input: {
          image: imageDataUrl,
          prompt: prompt,
          guidance_scale: 7.5,
          num_inference_steps: 28,
          output_format: 'png',
          output_quality: 90
        }
      });

      // Create prediction
      const replicateResponse = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: replicateUrl.hostname,
          port: replicateUrl.port || 443,
          path: replicateUrl.path,
          method: 'POST',
          headers: {
            'Authorization': `Token ${replicateToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              text: () => Promise.resolve(data),
              json: () => Promise.resolve(JSON.parse(data))
            });
          });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
      });

      if (!replicateResponse.ok) {
        const errorText = await replicateResponse.text();
        process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Variation ${i + 1} failed: ${replicateResponse.status} - ${errorText}\n`);
        errors.push(`Variation ${i + 1} failed: ${errorText}`);
        continue; // Continue with next variation
      }

      const prediction = await replicateResponse.json();
      const predictionId = prediction.id;

      // Poll for result (max 60 iterations, 2 seconds each = 120 seconds max)
      let headshotUrl = null;
      for (let j = 0; j < 60; j++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        const statusUrl = url.parse(`https://api.replicate.com/v1/predictions/${predictionId}`);
        const statusResponse = await new Promise((resolve, reject) => {
          const req = https.request({
            hostname: statusUrl.hostname,
            port: statusUrl.port || 443,
            path: statusUrl.path,
            method: 'GET',
            headers: {
              'Authorization': `Token ${replicateToken}`
            }
          }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              resolve({
                ok: res.statusCode >= 200 && res.statusCode < 300,
                status: res.statusCode,
                json: () => Promise.resolve(JSON.parse(data))
              });
            });
          });
          req.on('error', reject);
          req.end();
        });

        if (!statusResponse.ok) {
          process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Variation ${i + 1} status check failed: ${statusResponse.status}\n`);
          errors.push(`Variation ${i + 1} status check failed`);
          break;
        }

        const status = await statusResponse.json();

        if (status.status === 'succeeded') {
          headshotUrl = Array.isArray(status.output) ? status.output[0] : status.output;
          break;
        }

        if (status.status === 'failed' || status.status === 'canceled') {
          const errorMsg = status.error || 'Prediction failed';
          process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Variation ${i + 1} failed: ${errorMsg}\n`);
          errors.push(`Variation ${i + 1} failed: ${errorMsg}`);
          break;
        }
      }

      if (headshotUrl) {
        headshotUrls.push(headshotUrl);
      } else if (errors.length === 0) {
        process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Variation ${i + 1} timed out\n`);
        errors.push(`Variation ${i + 1} timed out`);
      }
    } catch (err) {
      process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Variation ${i + 1} error: ${err.message}\n`);
      errors.push(`Variation ${i + 1} error: ${err.message}`);
    }
    }

    // Calculate processing time
    const processingTime = (Date.now() - startTime) / 1000;

    // If no headshots were generated, throw error
    if (headshotUrls.length === 0) {
      process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] All variations failed\n`);
      throw new AppError(
        `Headshot generation failed: ${errors.join('; ')}`,
        400,
        'REPLICATE_ERROR',
        { 
          service: 'instant-influencer',
          code: 'REPLICATE_ERROR',
          message: `Headshot generation failed: ${errors.join('; ')}`,
          details: errors,
          requestId
        }
      );
    }

    process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Generated ${headshotUrls.length}/${variationCount} headshots\n`);

    // Return result (even if partial success)
    const result = {
      headshot_urls: headshotUrls,
      style_applied: style,
      processing_time: processingTime,
      num_generated: headshotUrls.length
    };

    // Add warnings for partial success
    if (headshotUrls.length < variationCount) {
      result.warnings = [`Only ${headshotUrls.length} headshot(s) generated (requested ${variationCount})`];
    }

    return result;
  } catch (err) {
    // Re-throw AppErrors as-is (already normalized)
    if (err instanceof AppError) {
      process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Error: ${err.code} - ${err.message}\n`);
      throw err;
    }
    // Wrap other errors with normalized format
    process.stderr.write(`[INSTANT_INFLUENCER] [${requestId}] Unexpected error: ${err.message}\n`);
    throw new AppError(
      `Headshot generation failed: ${err.message}`,
      500,
      'AI_TASK_FAILED',
      { 
        service: 'instant-influencer',
        code: 'AI_TASK_FAILED',
        message: err.message,
        details: err.message,
        requestId
      }
    );
  }
}

module.exports = {
  handle
};
