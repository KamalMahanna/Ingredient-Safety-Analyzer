from flask import Flask, request, jsonify
from flask_cors import CORS
from .utils.gemini_ai import Gemini
from .utils.tools import get_gemini_content, PromptsGenerator

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


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






# def analyze_ingredients():
#     try:
#         data = request.get_json()

#         if 'text' in data:
#             ingredients_text = data['text']
#             # Placeholder for Gemini model integration with text input
#             gemini_response = process_text_with_gemini(ingredients_text)
#         elif 'image' in data:
#             print("ok got the image")
#             image_base64 = data['image']
#             # Placeholder for Gemini model integration with image input
#             gemini_response = process_image_with_gemini(image_base64)
#         else:
#             return jsonify({"error": "Invalid request format. Provide 'text' or 'image'."}), 400

#         return jsonify({"message": gemini_response})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# def process_text_with_gemini(text_input):
#     """
#     Placeholder function to process text input with Gemini model.
#     Replace this with actual Gemini API call.
#     """
#     prompt = f"Analyze the safety and ingredients in the following text: {text_input}"
#     # TODO: Integrate with Gemini-2.0-flash-thinking-exp model for text input
#     return f"Gemini Response (Text Input): {prompt} - Model response will be here."

# def process_image_with_gemini(image_base64):
#     """
#     Placeholder function to process image input with Gemini model.
#     Replace this with actual Gemini API call.
#     """
#     # Decode base64 image (optional, depending on Gemini API requirements)
#     try:
#         image_data = base64.b64decode(image_base64)
#     except Exception as e:
#         print(f"Base64 decode error: {e}")
#         image_data = None

#     # TODO: Integrate with Gemini-2.0-flash-thinking-exp model for image input
#     return "Gemini Response (Image Input): Image analysis and model response will be here."


# def get_gemini_response (prompt):
#     model = "gemini-2.0-flash-thinking-exp-01-21"
