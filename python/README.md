# Python Ollama Gemma3 Example

This directory contains a Python script to interact with the Gemma3 model via a locally running Ollama instance.

## Prerequisites

- Python 3.7+
- Ollama installed and running. You can download it from [https://ollama.com/](https://ollama.com/).
- Gemma3 model pulled in Ollama:
  ```bash
  ollama pull gemma3
  ```
- An environment variable `OLLAMA_HOST` can be set if your Ollama instance is not running on `http://localhost:11434`.

## Setup

1.  Navigate to this `python` directory.
2.  Create a virtual environment (recommended):
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```
3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Example

Execute the script:

```bash
python ollama_gemma3_example.py
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `user_prompt` variable in the script to ask different questions.
