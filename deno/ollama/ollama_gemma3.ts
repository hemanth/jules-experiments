// Deno example for interacting with Gemma3 via Ollama using the Fetch API

// Get Ollama host from environment variable or use default
const OLLAMA_HOST = Deno.env.get("OLLAMA_HOST") || 'http://localhost:11434';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OllamaRequestBody {
    model: string;
    messages: ChatMessage[];
    stream?: boolean;
}

interface OllamaChoice {
    message: ChatMessage;
    // Add other potential fields if needed, e.g., finish_reason
}

interface OllamaResponse {
    model: string;
    created_at: string;
    choices: OllamaChoice[];
    done: boolean;
    // Add other potential fields if needed
}

async function chatWithGemma3(promptText: string): Promise<string> {
    const url = `${OLLAMA_HOST}/v1/chat/completions`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const body: OllamaRequestBody = {
        model: 'gemma3',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: promptText },
        ],
        stream: false, // Important for getting a single response object
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            return `Error: ${response.status} ${response.statusText}\n${errorBody}`;
        }

        const responseData = (await response.json()) as OllamaResponse;

        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
            return responseData.choices[0].message.content;
        } else {
            return `Error: Could not parse response from Ollama. Response: ${JSON.stringify(responseData)}`;
        }
    } catch (error) {
        return `Error communicating with Ollama: ${error.message || error}`;
    }
}

async function main() {
    console.log("Attempting to connect to Ollama...");
    // Test connection by trying to list models (a lightweight GET request)
    try {
        const testUrl = `${OLLAMA_HOST}/api/tags`; // Corresponds to `ollama list`
        const testResponse = await fetch(testUrl);
        if (testResponse.ok) {
            console.log("Successfully connected to Ollama.");
        } else {
            const errorBody = await testResponse.text();
            console.error(`Failed to connect to Ollama at ${OLLAMA_HOST}.`);
            console.error(`Error: ${testResponse.status} ${testResponse.statusText}\n${errorBody}`);
            console.error("\nPlease ensure Ollama is running and the OLLAMA_HOST environment variable is set correctly if not using the default.");
            Deno.exit(1);
        }
    } catch (e) {
        console.error(`Failed to connect to Ollama at ${OLLAMA_HOST}.`);
        console.error(`Error details: ${e.message || e}`);
        console.error("\nPlease ensure Ollama is running and the OLLAMA_HOST environment variable is set correctly if not using the default.");
        Deno.exit(1);
    }

    const userPrompt = "What makes Deno different from Node.js?";
    console.log(`\nSending prompt to Gemma3: '${userPrompt}'`);

    const assistantResponse = await chatWithGemma3(userPrompt);

    console.log("\nAssistant's Response:");
    console.log(assistantResponse);

    console.log("\n\nTo try a different prompt, run the script again or modify the userPrompt variable.");
}

if (import.meta.main) {
    main();
}
