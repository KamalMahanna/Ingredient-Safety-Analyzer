import google.generativeai as genai

# This file is used to get the response from the Gemini API.
def get_gemini_response(
    contents: list, api_key: str, model_name: str = "gemini-2.0-flash-thinking-exp-01-21"
) -> str:
    """
    This function gets the response from the Gemini API.
    Args:
        contents: The input contents to analyze
        api_key: The Gemini API key
        model_name: The model to use for generation
    """
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name=model_name)
        response = model.generate_content(contents=contents)
        return response.parts[-1].text

    except Exception as e:
        print(f"Gemini API error: {str(e)}")
        raise e
