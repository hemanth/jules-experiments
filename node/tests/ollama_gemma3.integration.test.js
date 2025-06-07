import { chatWithGemma3 } from '../ollama/ollama_gemma3.js';
import OpenAI from 'openai'; // For direct client instantiation for connection test
import process from 'process';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Function to check Ollama availability for integration tests
const isOllamaAvailable = async () => {
  try {
    const client = new OpenAI({ baseURL: `${OLLAMA_HOST}/v1`, apiKey: 'ollama' });
    await client.models.list();
    console.log(`Ollama seems available at ${OLLAMA_HOST} for Node.js integration tests.`);
    return true;
  } catch (e) {
    console.warn(`Ollama not available at ${OLLAMA_HOST} for Node.js integration tests. Error: ${e.message}`);
    return false;
  }
};

describe('chatWithGemma3 (Integration Tests)', () => {
  let ollamaReady = false;

  beforeAll(async () => {
    ollamaReady = await isOllamaAvailable();
  });

  // Conditionally skip tests if Ollama is not available
  const testIfOllamaReady = (testName, fn) => {
    if (ollamaReady) {
      test(testName, fn);
    } else {
      test.skip(\`Skipping \${testName} - Ollama not available\`, fn);
    }
  };

  testIfOllamaReady('should get a valid response from Gemma3 for a simple prompt', async () => {
    const prompt = "What is Node.js known for? Respond concisely.";
    const response = await chatWithGemma3(prompt);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    expect(response).not.toContain('Error communicating with Ollama');
    console.log(\`Node.js integration test prompt: '\${prompt}', Response: '\${response.substring(0,60)}...'\`);
  });

  testIfOllamaReady('should connect to Ollama and list models (main block equivalent)', async () => {
    // This re-tests the connection similar to how the main() in ollama_gemma3.js does.
    try {
      const client = new OpenAI({ baseURL: `${OLLAMA_HOST}/v1`, apiKey: 'ollama' });
      const models = await client.models.list();
      expect(models).toBeDefined();
      expect(Array.isArray(models.data)).toBe(true);
      console.log(\`Node.js integration test: Successfully listed models. Found \${models.data.length}.\`);
    } catch (e) {
      throw new Error(\`Ollama connection (models.list()) failed during Node.js integration test: \${e.message}\`);
    }
  });
});
