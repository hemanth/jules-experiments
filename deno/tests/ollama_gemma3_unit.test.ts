import {
    assertEquals,
    assertStringIncludes,
    assertThrows,
} from 'https://deno.land/std@0.224.0/assert/mod.ts'; // Using a specific version for stability
import {
    returnsNext,
    stub,
} from 'https://deno.land/std@0.224.0/testing/mock.ts';
import { chatWithGemma3 } from '../ollama/ollama_gemma3.ts'; // Adjust path as needed

Deno.test('chatWithGemma3 (Unit Tests)', async (t) => {
    const originalFetch = globalThis.fetch; // Store original fetch

    await t.step('should return message content on successful API call', async () => {
        const mockFetch = stub(globalThis, 'fetch', returnsNext([
            Promise.resolve(new Response(JSON.stringify({
                choices: [{ message: { content: 'Mocked Deno response' } }]
            }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
        ]));

        try {
            const prompt = 'Hello Deno Gemma';
            const response = await chatWithGemma3(prompt);
            assertEquals(response, 'Mocked Deno response');

            const fetchArgs = mockFetch.calls[0].args[0];
            const fetchOptions = mockFetch.calls[0].args[1];

            assertStringIncludes(fetchArgs, '/v1/chat/completions');
            assertEquals(fetchOptions?.method, 'POST');
            const body = JSON.parse(fetchOptions?.body as string);
            assertEquals(body.model, 'gemma3');
            assertEquals(body.messages[1].content, prompt);
        } finally {
            mockFetch.restore(); // Restore original fetch
        }
    });

    await t.step('should return error message on API error (e.g., 500)', async () => {
        const mockFetch = stub(globalThis, 'fetch', returnsNext([
            Promise.resolve(new Response(JSON.stringify({ error: 'Server error' }), { status: 500 }))
        ]));

        try {
            const response = await chatWithGemma3('Test API error');
            assertStringIncludes(response, 'Error: 500');
        } finally {
            mockFetch.restore();
        }
    });

    await t.step('should return error message on network error', async () => {
        const mockFetch = stub(globalThis, 'fetch', returnsNext([
            Promise.reject(new TypeError('Network request failed'))
        ]));

        try {
            const response = await chatWithGemma3('Test network error');
            assertStringIncludes(response, 'Error communicating with Ollama: Network request failed');
        } finally {
            mockFetch.restore();
        }
    });

    await t.step('should handle malformed JSON response', async () => {
        const mockFetch = stub(globalThis, 'fetch', returnsNext([
            Promise.resolve(new Response('Not JSON', { status: 200 }))
        ]));

        try {
            const response = await chatWithGemma3('Test malformed JSON');
            // Depending on JSON.parse, this might throw or return a specific error.
            // The current code catches the error from response.json()
            assertStringIncludes(response, 'Error communicating with Ollama:');
        } finally {
            mockFetch.restore();
        }
    });

    await t.step('should handle missing choices in response', async () => {
        const mockFetch = stub(globalThis, 'fetch', returnsNext([
            Promise.resolve(new Response(JSON.stringify({ data: 'no choices here' }), { status: 200 }))
        ]));

        try {
            const response = await chatWithGemma3('Test missing choices');
            assertStringIncludes(response, 'Error: Could not parse response from Ollama.');
        } finally {
            mockFetch.restore();
        }
    });

    // Restore original fetch if any test fails before finally
    globalThis.fetch = originalFetch;
});
