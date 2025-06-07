import os
from openai import OpenAI

# Get Ollama host from environment variable or use default
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

client = OpenAI(
    base_url = f"{OLLAMA_HOST}/v1",
    api_key='ollama', # required, but unused
)

def chat_with_gemma3(prompt: str) -> str:
    """
    Sends a prompt to the Gemma3 model via Ollama and returns the response.
    """
    try:
        response = client.chat.completions.create(
            model="gemma3",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error communicating with Ollama: {e}"

if __name__ == "__main__":
    print("Attempting to connect to Ollama...")
    # Test connection with a simple ping-like request
    try:
        client.models.list() # Any simple call to check connectivity
        print("Successfully connected to Ollama.")
    except Exception as e:
        print(f"Failed to connect to Ollama at {OLLAMA_HOST}.")
        print(f"Error details: {e}")
        print("\nPlease ensure Ollama is running and the OLLAMA_HOST environment variable is set correctly if not using the default.")
        exit(1)

    user_prompt = "What are the key features of the Gemma model family?"
    print(f"\nSending prompt to Gemma3: '{user_prompt}'")

    assistant_response = chat_with_gemma3(user_prompt)

    print("\nAssistant's Response:")
    print(assistant_response)

    print("\n\nTo try a different prompt, run the script again or modify the user_prompt variable.")
