import OpenAI from 'openai'; // To get the class for type checking if needed, but we'll mock the module
import { chatWithGemma3 } from '../ollama/ollama_gemma3.js';

// Mock the entire openai module
jest.mock('openai', () => {
  const mockCreate = jest.fn();
  // Mock the default export which is the OpenAI class
  return jest.fn().mockImplementation(() => { // Mock constructor
    return {
      chat: {
        completions: {
          create: mockCreate
        }
      },
      models: { // For the connection test in main()
        list: jest.fn()
      }
    };
  });
});

// Helper to get the mocked create function from the mocked OpenAI instance
// This is a bit indirect due to the way the client is instantiated in the module.
// A cleaner way would be if the client instance was passed into chatWithGemma3 or if it was more easily mockable.
// For now, we access the mock from the module-level mock.
const mockChatCompletionsCreate = new OpenAI().chat.completions.create; // Get the mock fn
const mockModelsList = new OpenAI().models.list; // Get the mock fn for connection test

describe('chatWithGemma3 (Unit Tests)', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockChatCompletionsCreate.mockClear();
    mockModelsList.mockClear();
  });

  test('should return message content on successful API call', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Mocked AI response' } }]
    };
    mockChatCompletionsCreate.mockResolvedValue(mockResponse);

    const prompt = 'Hello Gemma';
    const response = await chatWithGemma3(prompt);

    expect(response).toBe('Mocked AI response');
    expect(mockChatCompletionsCreate).toHaveBeenCalledWith({
      model: 'gemma3',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });
  });

  test('should return error message on API error', async () => {
    mockChatCompletionsCreate.mockRejectedValue(new Error('Network failure'));
    const prompt = 'Test error';
    const response = await chatWithGemma3(prompt);
    expect(response).toBe('Error communicating with Ollama: Network failure');
  });

  test('should handle malformed response (no choices)', async () => {
    const mockResponse = { choices: [] };
    mockChatCompletionsCreate.mockResolvedValue(mockResponse);
    const prompt = 'Test malformed no choices';
    const response = await chatWithGemma3(prompt);
    // Based on current ollama_gemma3.js, this would lead to "Cannot read properties of undefined (reading 'message')"
    // which is caught by the generic catch block.
    expect(response).toContain('Error communicating with Ollama:');
  });

  test('should handle malformed response (no message object)', async () => {
    const mockResponse = { choices: [{ message: undefined }] };
    mockChatCompletionsCreate.mockResolvedValue(mockResponse);
    const prompt = 'Test malformed no message object';
    const response = await chatWithGemma3(prompt);
    expect(response).toContain('Error communicating with Ollama:');
  });

  test('should handle malformed response (no content)', async () => {
    const mockResponse = { choices: [{ message: { content: null } }] };
    mockChatCompletionsCreate.mockResolvedValue(mockResponse);
    const prompt = 'Test malformed no content';
    const response = await chatWithGemma3(prompt);
    expect(response).toBeNull(); // The function returns the content directly
  });
});
