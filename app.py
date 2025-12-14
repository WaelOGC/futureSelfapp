import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import openai
from dotenv import load_dotenv
import base64
import io
import requests
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Replicate API configuration
REPLICATE_API_TOKEN = os.getenv('REPLICATE_API_TOKEN')
REPLICATE_API_URL = "https://api.replicate.com/v1"

# Verify API keys are loaded (masked for security)
if REPLICATE_API_TOKEN:
    print(f"[OK] Replicate API Token loaded: {REPLICATE_API_TOKEN[:10]}...{REPLICATE_API_TOKEN[-4:]}")
else:
    print("[ERROR] Replicate API Token not found in .env file")

openai_key = os.getenv('OPENAI_API_KEY')
if openai_key:
    print(f"[OK] OpenAI API Key loaded: {openai_key[:10]}...{openai_key[-4:]}")
else:
    print("[ERROR] OpenAI API Key not found in .env file")

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Handle the AI generation request"""
    try:
        # Validate API keys before processing
        if not REPLICATE_API_TOKEN:
            return jsonify({'error': 'Server configuration error: API keys are missing. Please check your .env file.'}), 500
        
        if not openai_key:
            return jsonify({'error': 'Server configuration error: API keys are missing. Please check your .env file.'}), 500
        
        # Get the uploaded image
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Get the dream text
        dream = request.form.get('dream', '')
        if not dream:
            return jsonify({'error': 'Dream text is required'}), 400
        
        # Save the uploaded image temporarily
        filename = secure_filename(image_file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(filepath)
        
        # Age the photo using Replicate API via HTTP requests
        try:
            headers = {
                "Authorization": f"Token {REPLICATE_API_TOKEN}",
                "Content-Type": "application/json"
            }
            
            # Upload the image file to Replicate
            upload_headers = {"Authorization": f"Token {REPLICATE_API_TOKEN}"}
            # Read the file content
            with open(filepath, 'rb') as f:
                file_content = f.read()
            
            # Upload with proper file handling
            files = {'file': (os.path.basename(filepath), file_content, 'image/jpeg')}
            upload_response = requests.post(
                f"{REPLICATE_API_URL}/files",
                headers=upload_headers,
                files=files
            )
            
            if upload_response.status_code != 201:
                raise Exception(f"Failed to upload image: {upload_response.text}")
            
            uploaded_file_url = upload_response.json()['urls']['get']
            
            # Create prediction with flux-dev model
            # Note: flux-dev may need specific version - we'll let Replicate resolve it
            prediction_payload = {
                "version": "latest",  # Replicate will resolve to latest version
                "input": {
                    "image": uploaded_file_url,
                    "prompt": "A realistic aged version of this person, showing them as they would look in 2050, with natural aging, wrinkles, gray hair, and wisdom in their eyes. Professional portrait style, high quality, photorealistic."
                }
            }
            
            # Use the model-specific predictions endpoint
            create_response = requests.post(
                f"{REPLICATE_API_URL}/models/black-forest-labs/flux-dev/predictions",
                headers=headers,
                json=prediction_payload
            )
            
            if create_response.status_code != 201:
                error_text = create_response.text
                # Try alternative: use general predictions endpoint
                prediction_payload["model"] = "black-forest-labs/flux-dev"
                create_response = requests.post(
                    f"{REPLICATE_API_URL}/predictions",
                    headers=headers,
                    json=prediction_payload
                )
                if create_response.status_code != 201:
                    raise Exception(f"Failed to create prediction: {error_text}")
            
            prediction = create_response.json()
            prediction_id = prediction['id']
            
            # Poll for completion (max 2 minutes)
            max_attempts = 60
            aged_image_url = None
            for attempt in range(max_attempts):
                status_response = requests.get(
                    f"{REPLICATE_API_URL}/predictions/{prediction_id}",
                    headers=headers
                )
                
                if status_response.status_code != 200:
                    raise Exception(f"Failed to check prediction status: {status_response.text}")
                
                prediction_status = status_response.json()
                status = prediction_status.get('status', '')
                
                if status == 'succeeded':
                    output = prediction_status.get('output')
                    if output:
                        aged_image_url = output[0] if isinstance(output, list) else output
                    break
                elif status == 'failed' or status == 'canceled':
                    error_msg = prediction_status.get('error', 'Unknown error')
                    raise Exception(f"Prediction {status}: {error_msg}")
                
                time.sleep(2)  # Wait 2 seconds before checking again
            
            if not aged_image_url:
                raise Exception("Prediction timed out or did not produce output")
            
        except Exception as e:
            # Clean up uploaded file
            if filepath and os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500
        
        # Generate wisdom letter using OpenAI
        try:
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are the user's Future Self in the year 2050. Write a letter to your past self (the user). Use a wise, emotional, and encouraging tone. Use 'we' and 'I' instead of 'you'. Write exactly 100 words maximum. Start with a nostalgic reflection on their dream, mentioning specific sensory details and feelings (e.g., if they dream of being a pilot, mention the feeling of clouds or the silence of the sky). End with one piece of life advice that isn't generic."
                    },
                    {
                        "role": "user",
                        "content": f"Write a 100-word wisdom letter from my future self in 2050 to my present self, based on this dream: {dream}"
                    }
                ],
                max_tokens=150,
                temperature=0.8
            )
            
            wisdom_letter = response.choices[0].message.content.strip()
            
        except Exception as e:
            # Clean up uploaded file
            if filepath and os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': f'Error generating letter: {str(e)}'}), 500
        
        # Clean up uploaded file
        if filepath and os.path.exists(filepath):
            os.remove(filepath)
        
        # Return the results
        return jsonify({
            'success': True,
            'aged_image_url': aged_image_url,
            'wisdom_letter': wisdom_letter
        })
        
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

if __name__ == '__main__':
    print("\n[STARTING] Future Self App...")
    print("[INFO] Server running on http://0.0.0.0:5000")
    print("[INFO] Access it at http://localhost:5000\n")
    app.run(host='0.0.0.0', port=5000, debug=True)

