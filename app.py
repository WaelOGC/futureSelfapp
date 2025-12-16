import os
import base64
import time
import requests
import subprocess
import json
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import openai

# Load environment variables explicitly at the very top
# Load from project root where app.py is located
try:
    from dotenv import load_dotenv
    import os
    # Get the directory where app.py is located (project root)
    project_root = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(project_root, '.env')
    load_dotenv(dotenv_path=env_path, override=True)
    print("[AUTO CHECK] Flask env ready")
except ImportError:
    print("[ENV] WARNING: python-dotenv not installed. Install with: pip install python-dotenv")
    print("[AUTO CHECK] Flask env ready (dotenv not available)")

# Safe boot log (no key values)
print("[ENV] OPENAI_API_KEY loaded in Flask:", bool(os.getenv("OPENAI_API_KEY")))
print("[ENV] REPLICATE_API_TOKEN loaded in Flask:", bool(os.getenv("REPLICATE_API_TOKEN")))

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_PROJECT_ID = os.getenv("OPENAI_PROJECT_ID")  # Optional project ID for project-based API keys
REPLICATE_API_URL = "https://api.replicate.com/v1/predictions"
REPLICATE_MODEL = "black-forest-labs/flux-dev"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/how-it-works")
def how_it_works():
    return render_template("how_it_works.html")

@app.route("/services")
def services():
    return render_template("services.html")

@app.route("/get-started")
def get_started():
    return render_template("get_started.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html")

@app.route("/terms")
def terms():
    return render_template("terms.html")

@app.route("/disclaimer")
def disclaimer():
    return render_template("disclaimer.html")

@app.route("/cookies")
def cookies():
    return render_template("cookies.html")

@app.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404

# Dev Dashboard Routes (development only)
@app.route("/dev")
def dev_dashboard():
    """Serve dev dashboard HTML (development only)"""
    if os.getenv("NODE_ENV") == "production":
        return jsonify({"error": "Not found"}), 404
    
    dashboard_path = os.path.join(os.path.dirname(__file__), "src", "dev", "dev.dashboard.html")
    if os.path.exists(dashboard_path):
        return send_file(dashboard_path)
    else:
        return jsonify({"error": "Dev dashboard not found"}), 404

@app.route("/dev/env", methods=["GET"])
def dev_env_check():
    """Diagnostic endpoint to check environment variable loading (development only)"""
    if os.getenv("NODE_ENV") == "production":
        return jsonify({"error": "Not found"}), 404
    
    # Python-side debug info
    openai_key = os.getenv("OPENAI_API_KEY", "")
    openai_key_last4 = "MISSING"
    if openai_key and len(openai_key) >= 4:
        openai_key_last4 = openai_key[-4:]
    
    # Determine .env path used (best effort)
    env_path_used = None
    possible_paths = [
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.getcwd(), ".env"),
    ]
    for possible_path in possible_paths:
        if os.path.exists(possible_path):
            env_path_used = os.path.abspath(possible_path)
            break
    
    if not env_path_used:
        env_path_used = "NOT_FOUND"
    
    # Get Node.js-side debug info
    node_debug_info = {}
    try:
        script_path = os.path.join(
            os.path.dirname(__file__),
            "src",
            "dev",
            "get-env-debug.js"
        )
        result = subprocess.run(
            ["node", script_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            node_debug_info = json.loads(result.stdout)
        else:
            node_debug_info = {"error": "Failed to get Node.js debug info", "stderr": result.stderr}
    except Exception as e:
        node_debug_info = {"error": f"Exception getting Node.js debug info: {str(e)}"}
    
    # Check if key is project-based
    is_project_key = openai_key.startswith("sk-proj-") if openai_key else False
    has_project_id = bool(os.getenv("OPENAI_PROJECT_ID"))
    
    # Get Replicate token info
    replicate_token = os.getenv("REPLICATE_API_TOKEN", "")
    replicate_token_last4 = "MISSING"
    if replicate_token and len(replicate_token) >= 4:
        replicate_token_last4 = replicate_token[-4:]
    
    # Get HeyGen key info
    heygen_key = os.getenv("HEYGEN_API_KEY", "")
    heygen_key_last4 = "MISSING"
    if heygen_key and len(heygen_key) >= 4:
        heygen_key_last4 = heygen_key[-4:]
    
    return jsonify({
        "python": {
            "OPENAI_API_KEY_loaded": bool(openai_key),
            "openaiKeyLast4": openai_key_last4,
            "keyFormat": "project-based (sk-proj-*)" if is_project_key else "standard (sk-*)" if openai_key else "none",
            "OPENAI_PROJECT_ID_loaded": has_project_id,
            "envPathUsed": env_path_used,
            "REPLICATE_API_TOKEN_loaded": bool(replicate_token),
            "replicateTokenLast4": replicate_token_last4,
            "HEYGEN_API_KEY_loaded": bool(heygen_key),
            "heygenKeyLast4": heygen_key_last4,
            "NODE_ENV": os.getenv("NODE_ENV", "development"),
            "keyLength": len(openai_key) if openai_key else 0
        },
        "nodejs": node_debug_info
    }), 200

@app.route("/dev/run", methods=["POST"])
def dev_run_ai_task():
    """Execute AI task via Node.js bridge (development only)"""
    if os.getenv("NODE_ENV") == "production":
        return jsonify({"error": "Not found"}), 404
    
    try:
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Request body must be JSON",
                    "code": "INVALID_INPUT",
                    "statusCode": 400
                }
            }), 400
        
        # Validate required fields
        provider = data.get("provider")
        task = data.get("task")
        payload = data.get("payload")
        
        if not provider or not task or not payload:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Missing required fields: provider, task, payload",
                    "code": "INVALID_INPUT",
                    "statusCode": 400
                }
            }), 400
        
        # Prepare input for Node.js script
        input_json = json.dumps({
            "provider": provider,
            "task": task,
            "payload": payload
        })
        
        # Get path to Node.js script
        script_path = os.path.join(
            os.path.dirname(__file__),
            "src",
            "dev",
            "run-ai-task.js"
        )
        
        # Call Node.js script via subprocess (deterministic and crash-safe)
        result = subprocess.run(
            ["node", script_path],
            input=input_json,
            capture_output=True,
            text=True,
            timeout=60,  # 60 second timeout
            env=os.environ.copy()
        )
        
        # Try to parse stdout as JSON first (prefer JSON output even if returncode != 0)
        try:
            output = json.loads(result.stdout)
            
            # Check for specific OpenAI errors that should return 400
            error = output.get("error", {})
            error_code = error.get("code", "")
            
            # Handle OpenAI-specific errors with status 400
            if error_code in ("OPENAI_KEY_MISSING", "OPENAI_ERROR") or "openai" in error.get("message", "").lower() or "invalid api key" in error.get("message", "").lower():
                return jsonify({
                    "success": False,
                    "error": {
                        "code": error_code or "OPENAI_ERROR",
                        "message": error.get("message", "OpenAI API error"),
                        "provider": provider,
                        "task": task
                    }
                }), 400
            
            # Return the parsed output (success or error)
            status_code = error.get("statusCode", 200) if not output.get("success") else 200
            return jsonify(output), status_code
            
        except json.JSONDecodeError as parse_err:
            # Failed to parse stdout as JSON - only treat as crash if no valid JSON
            if result.returncode != 0:
                # Node bridge crashed or exited with error and no valid JSON output
                stderr_snippet = result.stderr[-2000:] if result.stderr else "No stderr output"
                return jsonify({
                    "success": False,
                    "error": {
                        "code": "NODE_PROCESS_FAILED",
                        "message": "Node bridge crashed or exited with error",
                        "details": stderr_snippet,
                        "statusCode": 500
                    }
                }), 500
            else:
                # Returncode is 0 but JSON parsing failed - this should never happen
                stdout_snippet = result.stdout[-500:] if result.stdout else "No stdout output"
                stderr_snippet = result.stderr[-500:] if result.stderr else "No stderr output"
                return jsonify({
                    "success": False,
                    "error": {
                        "code": "NODE_OUTPUT_NOT_JSON",
                        "message": "Node bridge output is not valid JSON",
                        "details": {
                            "stdout_tail": stdout_snippet,
                            "stderr_tail": stderr_snippet,
                            "parse_error": str(parse_err)
                        },
                        "statusCode": 500
                    }
                }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            "success": False,
            "error": {
                "message": "AI task timed out",
                "code": "TIMEOUT",
                "statusCode": 504
            }
        }), 504
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "message": str(e),
                "code": "INTERNAL_ERROR",
                "statusCode": 500
            }
        }), 500

@app.route("/generate", methods=["POST"])
def generate():
    if not REPLICATE_API_TOKEN or not OPENAI_API_KEY:
        return jsonify({"error": "API keys missing"}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files["image"]
    dream = request.form.get("dream", "").strip()

    if not dream:
        return jsonify({"error": "Dream text required"}), 400

    filename = secure_filename(image.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    image.save(filepath)

    try:
        # Detect image format and convert to base64 data URL
        with open(filepath, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
        
        # Detect image MIME type based on file extension
        image_ext = os.path.splitext(filename)[1].lower()
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        mime_type = mime_types.get(image_ext, 'image/jpeg')
        image_data_url = f"data:{mime_type};base64,{encoded}"

        # Create comprehensive prompt that incorporates the user's dream
        # Combine aging instruction with the specific scenario from the dream
        image_prompt = f"A realistic aged version of this person in the year 2050, {dream}. Photorealistic, high quality, detailed, natural aging, maintaining the person's recognizable features while showing the passage of time."
        
        # Create Replicate prediction with enhanced parameters for better prompt adherence
        response = requests.post(
            REPLICATE_API_URL,
            headers={
                "Authorization": f"Token {REPLICATE_API_TOKEN}",
                "Content-Type": "application/json"
            },
            json={
                "version": REPLICATE_MODEL,  # Model identifier in owner/name format
                "input": {
                    "image": image_data_url,
                    "prompt": image_prompt,
                    "guidance_scale": 7.5,  # Higher value = better prompt adherence
                    "num_inference_steps": 28,  # More steps for better quality
                    "output_format": "png",
                    "output_quality": 90
                }
            },
            timeout=60
        )

        if response.status_code != 201:
            raise Exception(response.text)

        prediction_id = response.json()["id"]

        # Poll prediction
        for _ in range(60):
            status = requests.get(
                f"https://api.replicate.com/v1/predictions/{prediction_id}",
                headers={"Authorization": f"Token {REPLICATE_API_TOKEN}"}
            ).json()

            if status["status"] == "succeeded":
                aged_image_url = status["output"][0]
                break
            if status["status"] in ("failed", "canceled"):
                raise Exception(status.get("error", "Prediction failed"))
            time.sleep(2)
        else:
            raise Exception("Prediction timeout")

        # OpenAI letter - create a more personalized prompt
        # Build client configuration with optional project support
        client_config = {"api_key": OPENAI_API_KEY}
        if OPENAI_PROJECT_ID:
            client_config["default_headers"] = {"OpenAI-Project": OPENAI_PROJECT_ID}
        client = openai.OpenAI(**client_config)
        letter_prompt = f"""You are the user's future self in the year 2050, looking back on your journey. The user shared this dream with you: "{dream}"

Write a heartfelt, personalized wisdom letter (approximately 100-150 words) that:
- Reflects on how this dream has evolved or been realized
- Offers perspective and wisdom gained over the years
- Speaks directly to the specific scenario or wish they described
- Is warm, encouraging, and authentic
- Addresses the specific details they mentioned in their dream"""
        
        letter = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a wise, reflective future version of the user, writing from the year 2050. Your tone is warm, personal, and insightful."},
                {"role": "user", "content": letter_prompt}
            ],
            temperature=0.8,
            max_tokens=300
        ).choices[0].message.content.strip()

        return jsonify({
            "success": True,
            "aged_image_url": aged_image_url,
            "wisdom_letter": letter
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == "__main__":
    # Start Flask server (this blocks)
    # NOTE: No auto health check on startup (Windows instability risk)
    # Use /dev/env endpoint for environment checks instead
    app.run(host="0.0.0.0", port=5000, debug=True)
