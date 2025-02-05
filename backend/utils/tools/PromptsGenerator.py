# This file is used to generate prompts for the Gemini API.
class Generate:
    """
    This class is used to generate prompts for Ingredient analysis.
    """

    @staticmethod
    def prompt_for_image() -> str:
        """
        Generates a prompt if user provided an image.
        """
        prompt = """
            Act as a chemists who specialize in both food science and cosmetic formulations.
            Find all the ingredients from this image if any,
            if not found then return "Not found any".
            Now for each ingredient check if it is safe or not.
            Sort them by safe and unsafe, also how it is safe and if unsafe then why.

            Your output should be in following example format:

            ### Unsafe:
            - **Ingredient 1**    Health Benefits of ingredient 1
            - **Ingredient 2**    Health Benefits of ingredient 2
            ...
            ### Safe:
            - **Ingredient 3**    Health risk of ingredient 3
            - **Ingredient 4**    Health risk of ingredient 4
            ...
            ### Comments:
            Add some comment if it is safe or unsafe
            """
        return prompt
    
    @staticmethod
    def prompt_for_text(ingrdients: str) -> str:
        """
        Generates a prompt if user provided with text.
        """
        prompt = f"""
            Act as a chemists who specialize in both food science and cosmetic formulations.
            Provided ingredients are delimited by angle brackets,
            if not found then return "Not found any".
            Now for each ingredient check if it is safe or not.
            Sort them by safe and unsafe, also how it is safe and if unsafe then why.

            Your output should be in following example format:
            
            ### Unsafe:
            - **Ingredient 1**    Health Benefits of ingredient 1
            - **Ingredient 2**    Health Benefits of ingredient 2
            ...
            ### Safe:
            - **Ingredient 3**    Health risk of ingredient 3
            - **Ingredient 4**    Health risk of ingredient 4
            ...
            ### Comments:
            Add some comment if it is safe or unsafe

            -----------
            here is the ingredients:
            <{ingrdients}>
            """
        return prompt