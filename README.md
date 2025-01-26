# Ingredient Safety Analyzer

In a world where ingredient lists are longer than ever and understanding what you consume and use daily is increasingly complex, the Ingredient Safety Analyzer emerges as your trusted ally.  Imagine holding a product in your hand, be it a snack, a cosmetic, or a household item, and instantly knowing the safety profile of every ingredient. Are you concerned about hidden allergens, synthetic additives, or potentially harmful chemicals?

This innovative tool, powered by the cutting-edge Gemini AI, is designed to bring clarity and confidence to your purchasing decisions. By simply uploading a product image or pasting an ingredient list, you unlock a detailed analysis revealing the reality behind each component.  We connect you with the truth, showing you how Gemini AI can dissect and decipher complex ingredient information, making healthy and safe choices easier than ever.

Try out our hosted website here [Click Here](https://ingredient-safety-analyzer.netlify.app/)

## Getting Started

This guide will walk you through the steps to run the Ingredient Safety Analyzer project locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Python:**  You can download Python from the official website: [https://www.python.org/downloads/](https://www.python.org/downloads/). Make sure to add Python to your PATH during installation. You can verify the installation by opening a terminal and running:

  ```bash
  python3 --version
  ```
* **Node.js and pnpm:** You can download Node.js from the official website: [https://nodejs.org/](https://nodejs.org/). pnpm is a package manager for Node.js. You can verify the installation by opening a terminal and running:

  ```bash
  node --version
  
  # install pnpm
  npm install -g pnpm
  ```

### Installation

1. **Clone the repository:**

   If you haven't cloned the repository yet, clone it using git:

   ```bash
   git clone -b localhost https://github.com/KamalMahanna/Ingredient-Safety-Analyzer
   ```

   Navigate to the project directory:

   ```bash
   cd Ingredient-Safety-Analyzer
   ```
2. **Install Python dependencies (backend):**

   Install the required Python packages. It's recommended to use a virtual environment.

   ```bash
   # create new virtual environment
   python3 -m venv ing_saf_env

   # Activate the environement
   source ing_saf_env/bin/activate

   # install python dependencies
   pip install -r requirements.txt
   ```


### Configuration

1. **Obtain a Gemini API Key:**

   * Go to the Google AI Studio website: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   * Create a project if you haven't already.
   * Generate an API key.
2. **Configure Environment Variables:**

   * Rename `.env.example` file to `.env`.

     ```bash
     mv .env.example .env
     ```
   * Open the `.env` file and add your Gemini API key:

     ```
     GEMINI_API_KEY=YOUR_API_KEY_HERE
     ```

     Replace `YOUR_API_KEY_HERE` with the API key you obtained.

### Running the Application

To run the development servers:

1. **Start the backend server:**
   ```bash
   gunicorn backend.app:app
   ```
   The backend server will start running at `http://127.0.0.1:8000`.

2. **Start the frontend server:**

   Open a new terminal, navigate to the `frontend` directory, install npm dependencies and start the frontend development server:

   ```bash
   cd frontend
   pnpm install && pnpm run dev
   ```

   The frontend application will be accessible at `http://localhost:5173`.

### Accessing the Application

Once both servers are running, open your web browser and go to `http://localhost:5173` to access the Ingredient Safety Analyzer application.

The frontend application will interact with the backend API to analyze ingredient safety using the Gemini AI API. Ensure your Gemini API key is correctly set in the backend `.env` file for the application to function properly.