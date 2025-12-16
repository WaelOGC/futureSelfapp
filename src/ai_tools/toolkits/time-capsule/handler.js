// Time Capsule tool handler

const { runAiTask } = require('../../../ai/orchestration/ai.router');
const { AI_TASKS } = require('../../../ai/contracts/ai.interface');
const { AppError } = require('../../../core/errors/error.handler');

/**
 * Handle time-capsule tool execution
 * Orchestrates both image aging (Replicate) and wisdom letter generation (OpenAI)
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override (for wisdom letter)
 * @param {string} params.identity - User identity
 * @returns {Promise<Object>} Combined result with aged_image_url and wisdom_letter
 */
async function handle({ payload, providerOverride, identity }) {
  const startTime = Date.now();
  const provider = providerOverride || 'OPENAI';

  // Validate Replicate API token
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new AppError(
      'REPLICATE_API_TOKEN is not loaded. Ensure .env exists at project root and contains REPLICATE_API_TOKEN.',
      500,
      'REPLICATE_KEY_MISSING'
    );
  }

  // Step 1: Generate wisdom letter using OpenAI
  let wisdomLetter;
  let wordCount = 0;
  try {
    const dreamText = payload.dream.trim();
    const letterPrompt = `Write a personalized wisdom letter from my future self in 2050, reflecting on my current dream: ${dreamText}

The letter should be 100-150 words, warm, reflective, and encouraging.`;

    const systemPrompt = `You are a wise, reflective version of the user writing from the year 2050. Write a personalized letter that reflects on their current dreams and provides guidance, motivation, and perspective. Be warm, encouraging, and thoughtful.

Requirements:
- 100-150 words exactly
- Written from perspective of "future self" in 2050
- Must reference the user's specific dream/aspiration
- Tone: warm, reflective, encouraging
- Format: Letter format with greeting and closing`;

    const letterResult = await runAiTask({
      provider,
      task: AI_TASKS.TEXT_GENERATION,
      payload: {
        prompt: letterPrompt,
        system: systemPrompt,
        model: 'gpt-4o-mini',
        max_tokens: 300
      },
      identity
    });

    wisdomLetter = letterResult.data;
    
    // Count words in the letter
    wordCount = wisdomLetter.trim().split(/\s+/).filter(word => word.length > 0).length;
  } catch (err) {
    // Log error but continue with image aging
    process.stderr.write(`[TIME_CAPSULE] Wisdom letter generation failed: ${err.message}\n`);
    wisdomLetter = null;
  }

  // Step 2: Age image using Replicate API
  let agedImageUrl;
  try {
    const dreamText = payload.dream.trim();
    const imagePrompt = `Age this person to show how they would look in 2050, maintaining their recognizable features while incorporating natural aging. Consider their dream: ${dreamText}`;

    // Call Replicate API directly (not abstracted in provider layer)
    // Use Node.js built-in https module for compatibility
    const https = require('https');
    const url = require('url');
    
    const replicateUrl = url.parse('https://api.replicate.com/v1/predictions');
    const postData = JSON.stringify({
      version: 'black-forest-labs/flux-dev',
      input: {
        image: payload.image,
        prompt: imagePrompt,
        guidance_scale: 7.5,
        num_inference_steps: 28,
        output_format: 'png',
        output_quality: 90
      }
    });

    const replicateResponse = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: replicateUrl.hostname,
        port: replicateUrl.port || 443,
        path: replicateUrl.path,
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
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
      throw new AppError(
        `Replicate API error: ${errorText}`,
        400,
        'REPLICATE_ERROR',
        { status: replicateResponse.status }
      );
    }

    const prediction = await replicateResponse.json();
    const predictionId = prediction.id;

    // Poll for result (max 60 iterations, 2 seconds each = 120 seconds max)
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const statusUrl = url.parse(`https://api.replicate.com/v1/predictions/${predictionId}`);
      const statusResponse = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: statusUrl.hostname,
          port: statusUrl.port || 443,
          path: statusUrl.path,
          method: 'GET',
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
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
        throw new AppError(
          `Replicate API error: Failed to check prediction status`,
          400,
          'REPLICATE_ERROR'
        );
      }

      const status = await statusResponse.json();

      if (status.status === 'succeeded') {
        agedImageUrl = Array.isArray(status.output) ? status.output[0] : status.output;
        break;
      }

      if (status.status === 'failed' || status.status === 'canceled') {
        throw new AppError(
          `Replicate API error: ${status.error || 'Prediction failed'}`,
          400,
          'REPLICATE_ERROR'
        );
      }
    }

    if (!agedImageUrl) {
      throw new AppError(
        'Replicate API error: Prediction timeout',
        504,
        'TIMEOUT'
      );
    }
  } catch (err) {
    // If image aging fails, we still return partial result if letter succeeded
    if (wisdomLetter) {
      process.stderr.write(`[TIME_CAPSULE] Image aging failed: ${err.message}\n`);
      agedImageUrl = null;
    } else {
      // Both failed, throw error
      throw err;
    }
  }

  // Calculate processing time
  const processingTime = (Date.now() - startTime) / 1000;

  // Return combined result
  return {
    aged_image_url: agedImageUrl,
    wisdom_letter: wisdomLetter,
    word_count: wordCount,
    processing_time: processingTime
  };
}

module.exports = {
  handle
};
