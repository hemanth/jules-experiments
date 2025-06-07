import pytest
from unittest.mock import MagicMock
from python.ollama.ollama_gemma3 import chat_with_gemma3

def test_chat_with_gemma3_success(mocker):
    mock_chat_create = mocker.patch('python.ollama.ollama_gemma3.client.chat.completions.create')

    mock_response_content = MagicMock()
    mock_response_content.message = MagicMock()
    mock_response_content.message.content = "Test response"

    mock_full_response = MagicMock()
    mock_full_response.choices = [mock_response_content]

    mock_chat_create.return_value = mock_full_response

    prompt = "Test prompt"
    response = chat_with_gemma3(prompt)

    mock_chat_create.assert_called_once_with(
        model="gemma3",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    assert response == "Test response"

def test_chat_with_gemma3_api_error(mocker):
    mock_chat_create = mocker.patch('python.ollama.ollama_gemma3.client.chat.completions.create')
    mock_chat_create.side_effect = Exception("API Error")

    prompt = "Test prompt for error"
    response = chat_with_gemma3(prompt)

    assert "Error communicating with Ollama: API Error" in response

def test_chat_with_gemma3_malformed_response_no_choices(mocker):
    mock_chat_create = mocker.patch('python.ollama.ollama_gemma3.client.chat.completions.create')

    malformed_response = MagicMock()
    malformed_response.choices = [] # No choices array

    mock_chat_create.return_value = malformed_response

    prompt = "Test prompt for malformed (no choices)"
    response = chat_with_gemma3(prompt)
    assert "Error communicating with Ollama: list index out of range" in response

def test_chat_with_gemma3_malformed_response_no_message(mocker):
    mock_chat_create = mocker.patch('python.ollama.ollama_gemma3.client.chat.completions.create')

    mock_choice = MagicMock()
    mock_choice.message = None

    malformed_response = MagicMock()
    malformed_response.choices = [mock_choice]

    mock_chat_create.return_value = malformed_response

    prompt = "Test prompt for malformed (no message)"
    response = chat_with_gemma3(prompt)
    assert "Error communicating with Ollama: 'NoneType' object has no attribute 'content'" in response

def test_chat_with_gemma3_malformed_response_no_content(mocker):
    mock_chat_create = mocker.patch('python.ollama.ollama_gemma3.client.chat.completions.create')

    mock_message = MagicMock()
    mock_message.content = None

    mock_choice = MagicMock()
    mock_choice.message = mock_message

    malformed_response = MagicMock()
    malformed_response.choices = [mock_choice]

    mock_chat_create.return_value = malformed_response

    prompt = "Test prompt for malformed (no content)"
    response = chat_with_gemma3(prompt)
    assert response is None
