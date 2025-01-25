import base64
import imghdr

def get_gemini_content(image_base64: str, prompt: str):
    """
    This function prepares the content for Gemini API from base64 image.
    """
    if image_base64.startswith("data:image"):
        image_base64 = image_base64.split(",")[1]

    image_data = base64.b64decode(image_base64)
    image_type = imghdr.what(None, image_data)
    mime_type = f"image/{image_type}" if image_type else "image/jpeg" # Default to jpeg if type is unknown
    contents = [{"mime_type": mime_type, "data": image_data}, prompt]
    return contents
