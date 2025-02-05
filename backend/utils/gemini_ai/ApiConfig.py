import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../../.env")


# This file is used to get the Gemini API key from the environment variables.
def get_api_key() -> str:
    """
    Returns the Gemini API key.
    """
    return os.getenv("GEMINI_API_KEY")


if __name__ == "__main__":
    print(get_api_key())
