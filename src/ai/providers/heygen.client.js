// HeyGen provider client implementation

const { getEnv } = require('../../core/env/env.loader');
const { AppError } = require('../../core/errors/error.handler');

const HEYGEN_UPLOAD_URL = 'https://upload.heygen.com/v1/asset';
const HEYGEN_API_BASE = 'https://api.heygen.com/v2';

/**
 * Create HeyGen client instance
 * @returns {Object} HeyGen client with handler methods
 */
function createHeyGenClient() {
  // Load API key from environment
  let apiKey = getEnv('HEYGEN_API_KEY', { required: false });
  if (apiKey && typeof apiKey === 'string') {
    apiKey = apiKey.trim();
    // Treat whitespace-only strings as missing
    if (apiKey === '') {
      apiKey = undefined;
    }
  }

  /**
   * Make authenticated request to HeyGen API
   * @private
   */
  async function makeRequest(url, options = {}) {
    if (!apiKey) {
      throw new AppError(
        'HEYGEN_API_KEY is not loaded. Ensure .env exists at project root and contains HEYGEN_API_KEY.',
        500,
        'PROVIDER_KEY_MISSING'
      );
    }

    const headers = {
      'x-api-key': apiKey,
      ...options.headers
    };

    // Use https module for consistency across Node versions
    const https = require('https');
    const urlModule = require('url');
    const parsedUrl = urlModule.parse(url);

    const response = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: options.method || 'GET',
        headers
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            text: () => Promise.resolve(data),
            json: () => {
              try {
                return Promise.resolve(JSON.parse(data));
              } catch (err) {
                return Promise.reject(new Error(`Invalid JSON response: ${err.message}`));
              }
            }
          });
        });
      });
      req.on('error', reject);
      
      if (options.body) {
        if (typeof options.body === 'string') {
          req.write(options.body);
        } else if (Buffer.isBuffer(options.body)) {
          req.write(options.body);
        }
      }
      req.end();
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        errorData = { message: text || response.statusText };
      }

      throw new AppError(
        `HeyGen API error: ${errorData.error || errorData.message || response.statusText}`,
        400,
        'PROVIDER_ERROR',
        { status: response.status, originalError: errorData }
      );
    }

    return response;
  }

  /**
   * Upload asset to HeyGen
   * @param {Object} params - Upload parameters
   * @param {Buffer} params.buffer - File buffer
   * @param {string} params.filename - Filename
   * @param {string} params.mimeType - MIME type
   * @returns {Promise<Object>} { asset_id, url }
   */
  async function uploadAsset({ buffer, filename, mimeType }) {
    try {
      // Build multipart/form-data manually (works across all Node versions)
      const boundary = `----WebKitFormBoundary${Date.now()}${Math.random().toString(36).substring(2, 15)}`;
      const CRLF = '\r\n';
      
      // Build multipart body
      const headerPart = `--${boundary}${CRLF}` +
        `Content-Disposition: form-data; name="file"; filename="${filename}"${CRLF}` +
        `Content-Type: ${mimeType}${CRLF}${CRLF}`;
      
      const footerPart = `${CRLF}--${boundary}--${CRLF}`;
      
      const body = Buffer.concat([
        Buffer.from(headerPart, 'utf8'),
        buffer,
        Buffer.from(footerPart, 'utf8')
      ]);
      
      const contentType = `multipart/form-data; boundary=${boundary}`;

      // Use https module for multipart upload (more reliable than fetch for this)
      const https = require('https');
      const urlModule = require('url');
      const parsedUrl = urlModule.parse(HEYGEN_UPLOAD_URL);

      const response = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || 443,
          path: parsedUrl.path,
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': contentType,
            'Content-Length': body.length
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
        req.write(body);
        req.end();
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: await response.text() };
        }

        throw new AppError(
          `HeyGen API error: ${errorData.error || errorData.message || response.statusText}`,
          400,
          'PROVIDER_ERROR',
          { status: response.status, originalError: errorData }
        );
      }

      const data = await response.json();
      
      // Handle HeyGen response format: may be { error, data } or direct response
      const result = data.data || data;
      
      // Extract asset_id and url defensively
      return {
        asset_id: result.asset_id || result.id || result.assetId,
        url: result.url || result.asset_url || result.assetUrl
      };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        `HeyGen asset upload failed: ${err.message}`,
        400,
        'PROVIDER_ERROR',
        { originalError: err.message }
      );
    }
  }

  /**
   * List target languages supported by HeyGen
   * @returns {Promise<Array>} Array of { name, code? }
   */
  async function listTargetLanguages() {
    try {
      const response = await makeRequest(`${HEYGEN_API_BASE}/video_translate/target_languages`, {
        method: 'GET'
      });

      const data = await response.json();
      const languages = data.data || data.languages || data || [];

      // Normalize to { name, code? } format
      return languages.map(lang => {
        if (typeof lang === 'string') {
          return { name: lang };
        }
        return {
          name: lang.name || lang.language || lang.label,
          code: lang.code || lang.iso_code || lang.isoCode
        };
      });
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        `HeyGen list languages failed: ${err.message}`,
        400,
        'PROVIDER_ERROR',
        { originalError: err.message }
      );
    }
  }

  /**
   * Translate video using HeyGen
   * @param {Object} params - Translation parameters
   * @param {string} params.videoUrl - Video URL (from uploadAsset)
   * @param {Array<string>} params.outputLanguages - Array of target language names
   * @param {string} params.title - Optional title
   * @returns {Promise<Object>} { video_translate_id OR video_translate_ids[] }
   */
  async function translateVideo({ videoUrl, outputLanguages, title }) {
    try {
      const payload = {
        video_url: videoUrl,
        output_languages: Array.isArray(outputLanguages) ? outputLanguages : [outputLanguages]
      };

      if (title) {
        payload.title = title;
      }

      const response = await makeRequest(`${HEYGEN_API_BASE}/video_translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const result = data.data || data;

      // Handle both single ID and array of IDs
      if (result.video_translate_id) {
        return { video_translate_id: result.video_translate_id };
      }
      if (result.video_translate_ids && Array.isArray(result.video_translate_ids)) {
        return { video_translate_ids: result.video_translate_ids };
      }
      if (result.id) {
        return { video_translate_id: result.id };
      }
      if (Array.isArray(result)) {
        return { video_translate_ids: result };
      }

      // If we can't find the ID, return the raw result
      return result;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        `HeyGen video translation failed: ${err.message}`,
        400,
        'PROVIDER_ERROR',
        { originalError: err.message }
      );
    }
  }

  /**
   * Get translation status
   * @param {Object} params - Status parameters
   * @param {string} params.videoTranslateId - Translation job ID
   * @returns {Promise<Object>} { status, url?, error?, raw }
   */
  async function getTranslationStatus({ videoTranslateId }) {
    try {
      const response = await makeRequest(`${HEYGEN_API_BASE}/video_translate/${videoTranslateId}`, {
        method: 'GET'
      });

      const data = await response.json();
      const result = data.data || data;

      // Extract status and URL defensively
      const status = result.status || result.state || 'unknown';
      const url = result.url || result.video_url || result.videoUrl || result.download_url || result.downloadUrl;
      const error = result.error || result.error_message || result.errorMessage;

      return {
        status: status.toLowerCase(),
        url,
        error,
        raw: result
      };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        `HeyGen status check failed: ${err.message}`,
        400,
        'PROVIDER_ERROR',
        { originalError: err.message }
      );
    }
  }

  return {
    uploadAsset,
    listTargetLanguages,
    translateVideo,
    getTranslationStatus
  };
}

module.exports = {
  createHeyGenClient
};
