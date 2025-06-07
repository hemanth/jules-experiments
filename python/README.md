# Python Ollama Gemma3 Example

This directory contains a Python script (`ollama/ollama_gemma3.py`) to interact with the Gemma3 model via a locally running Ollama instance.

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
3.  Install the required dependencies (including test dependencies):
    ```bash
    pip install -r requirements.txt
    ```

## Running the Example

Execute the script from the `python` directory:

```bash
python ollama/ollama_gemma3.py
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `user_prompt` variable in the script to ask different questions.

## Running Tests

Tests are written using `pytest`.

1.  **Install Test Dependencies**:
    Ensure you have installed all dependencies, including those for testing:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run All Tests**:
    From within the `python` directory, you can run all tests (both unit and integration):
    ```bash
    pytest
    ```
    or
    ```bash
    python -m pytest
    ```

3.  **Run Only Unit Tests**:
    To run only the unit tests (which do not require a live Ollama instance):
    ```bash
    pytest tests/test_ollama_gemma3_unit.py
    ```

4.  **Run Only Integration Tests**:
    Integration tests are marked with `@pytest.mark.integration`. These tests require a running Ollama instance configured via `OLLAMA_HOST`.
    To run only integration tests:
    ```bash
    pytest -m integration tests/test_ollama_gemma3_integration.py
    ```
    or more broadly to run any test marked with `integration`:
    ```bash
    pytest -m integration
    ```
    **Note**: Integration tests will be automatically skipped if the script cannot connect to the Ollama instance specified by `OLLAMA_HOST` (defaulting to `http://localhost:11434`). You will see a message indicating this if they are skipped.
