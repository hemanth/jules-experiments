import {
    assert,
    assertEquals,
    assertStringIncludes
} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { chatWithGemma3 } from '../ollama/ollama_gemma3.ts';

// Function to check Ollama availability
async function isOllamaAvailable(): Promise<boolean> {
    const ollamaHost = Deno.env.get("OLLAMA_HOST") || 'http://localhost:11434';
    try {
        const response = await fetch(`${ollamaHost}/api/tags`);
        if (response.ok) {
            console.log(`Deno integration tests: Ollama appears available at ${ollamaHost}.`);
            return true;
        }
        console.warn(`Deno integration tests: Ollama not fully available at ${ollamaHost}. Status: ${response.status}`);
        return false;
    } catch (e) {
        console.warn(`Deno integration tests: Ollama not reachable at ${ollamaHost}. Error: ${e.message}`);
        return false;
    }
}

const ollamaReady = await isOllamaAvailable();

Deno.test('chatWithGemma3 (Integration Tests)', { ignore: !ollamaReady }, async (t) => {
    await t.step('should get a valid response from Gemma3 for a simple prompt', async () => {
        const prompt = "What is Deno? Respond in one sentence.";
        const response = await chatWithGemma3(prompt);
        assert(typeof response === 'string', "Response should be a string");
        assert(response.length > 0, "Response should not be empty");
        assert(!response.startsWith('Error communicating with Ollama'), "Response should not be an error message");
        console.log(`Deno integration test prompt: '\${prompt}', Response: '\${response.substring(0, 70)}...'`);
    });

    await t.step('main connection test logic equivalent', async () => {
        // The main script has its own connection test; this validates similar logic.
        const ollamaHost = Deno.env.get("OLLAMA_HOST") || 'http://localhost:11434';
        const testUrl = `${ollamaHost}/api/tags`;
        try {
            const response = await fetch(testUrl);
            assert(response.ok, `Failed to connect for model list: ${response.status}`);
            const data = await response.json();
            assert(Array.isArray(data.models), "Expected models list to be an array");
            console.log(\`Deno integration test: Successfully listed models. Found \${data.models.length}.\`);
        } catch (e) {
            assert(false, `Ollama connection (api/tags) failed during Deno integration test: ${e.message}`);
        }
    });
});

// Log final status for clarity if tests are ignored
if (!ollamaReady) {
    console.warn("Deno integration tests were skipped because Ollama was not available.");
}
