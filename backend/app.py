from flask import Flask, request, jsonify
from flask_cors import CORS
from .utils.gemini_ai import Gemini
from .utils.tools import get_gemini_content, PromptsGenerator

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://ingredient-safety-analyzer.netlify.app"}})


@app.route('/', methods=['POST'])
def analyze_ingredients():
    try:
        data = request.get_json()

        prompt_generator = PromptsGenerator.Generate()

        if 'text' in data:
            ingredients_text = data['text']
            prompt = prompt_generator.prompt_for_text(ingredients_text)
            gemini_response = Gemini.get_gemini_response(prompt)
        
        if 'image' in data:
            image_base64 = data['image']
            prompt = prompt_generator.prompt_for_image()
            content = get_gemini_content(image_base64, prompt)
            gemini_response = Gemini.get_gemini_response(content)

        return jsonify({"message": gemini_response})

    except Exception as e:
        print(f"Error during image analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)
