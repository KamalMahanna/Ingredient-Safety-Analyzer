from flask import Flask, request, jsonify
from flask_cors import CORS
from .utils.gemini_ai import Gemini
from .utils.tools import get_gemini_content, PromptsGenerator
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://ingredient-safety-analyzer.netlify.app"}})

def verify_api_key(api_key):
    """Verify if the provided API key can be used to initialize Gemini"""
    try:
        test_prompt = "Test"
        Gemini.get_gemini_response(test_prompt, api_key)
        return True
    except Exception as e:
        print(f"API key verification failed: {str(e)}")
        return False

@app.route('/verify-key', methods=['POST'])
def verify_key():
    try:
        data = request.get_json()
        api_key = data.get('api_key')
        
        if not api_key:
            return jsonify({"error": "No API key provided"}), 400
            
        is_valid = verify_api_key(api_key)
        
        if is_valid:
            return jsonify({"valid": True})
        else:
            return jsonify({"valid": False, "error": "Invalid API key"}), 401
            
    except Exception as e:
        print(f"Error during key verification: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['POST'])
def analyze_ingredients():
    try:
        data = request.get_json()
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return jsonify({"error": "API key required"}), 401

        if not verify_api_key(api_key):
            return jsonify({"error": "Invalid API key"}), 401

        prompt_generator = PromptsGenerator.Generate()

        if 'text' in data:
            ingredients_text = data['text']
            prompt = prompt_generator.prompt_for_text(ingredients_text)
            gemini_response = Gemini.get_gemini_response(prompt, api_key)
        
        if 'image' in data:
            image_base64 = data['image']
            prompt = prompt_generator.prompt_for_image()
            content = get_gemini_content(image_base64, prompt)
            gemini_response = Gemini.get_gemini_response(content, api_key)

        return jsonify({"message": gemini_response})

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
