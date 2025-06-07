import pytest
import os
from python.ollama.ollama_gemma3 import chat_with_gemma3, client as ollama_client

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

ollama_available = False
try:
    # The client is initialized at module import time in ollama_gemma3.py
    # This check uses that imported client.
    ollama_client.models.list()
    ollama_available = True
    print(f"Ollama instance appears to be available at {OLLAMA_HOST} for integration tests. Client base URL: {ollama_client.base_url}")
except Exception as e:
    print(f"Ollama instance not available at {OLLAMA_HOST} for integration tests. Client base URL: {ollama_client.base_url}. Error: {e}")
    ollama_available = False

@pytest.mark.skipif(not ollama_available, reason="Ollama instance not available/accessible for integration tests")
@pytest.mark.integration
def test_integration_chat_with_gemma3_simple_prompt():
    prompt = "What is the capital of France? Respond with only the name of the city."
    response = chat_with_gemma3(prompt)

    assert isinstance(response, str)
    assert len(response) > 0
    assert "Error communicating with Ollama" not in response
    print(f"Integration test prompt: '{prompt}', Response: '{response}'")

@pytest.mark.skipif(not ollama_available, reason="Ollama instance not available/accessible for integration tests")
@pytest.mark.integration
def test_integration_ollama_connection_can_list_models():
    try:
        models_response = ollama_client.models.list()
        assert models_response is not None
        assert hasattr(models_response, 'data')
        assert isinstance(models_response.data, list)
        print(f"Successfully listed models: {len(models_response.data)} found.")
    except Exception as e:
        pytest.fail(f"Ollama connection (models.list()) failed during integration test: {e}")
