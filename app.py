import os
import base64
import time
import requests
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import openai

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
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
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
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
    app.run(host="0.0.0.0", port=5000, debug=True)
