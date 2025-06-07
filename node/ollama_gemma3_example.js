import OpenAI from 'openai';
import process from 'process'; // Import process for env variables

// Get Ollama host from environment variable or use default
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

const client = new OpenAI({
    baseURL: `${OLLAMA_HOST}/v1`,
    apiKey: 'ollama', // required, but unused
});

async function chatWithGemma3(prompt) {
    try {
        const response = await client.chat.completions.create({
            model: 'gemma3',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        return `Error communicating with Ollama: ${error.message}`;
    }
}

async function main() {
    console.log("Attempting to connect to Ollama...");
    try {
        await client.models.list(); // Any simple call to check connectivity
        console.log("Successfully connected to Ollama.");
    } catch (e) {
        console.error(`Failed to connect to Ollama at ${OLLAMA_HOST}.`);
        console.error(`Error details: ${e.message}`);
        console.error("\nPlease ensure Ollama is running and the OLLAMA_HOST environment variable is set correctly if not using the default.");
        process.exit(1);
    }

    const userPrompt = "What are some common use cases for Node.js in web development?";
    console.log(`\nSending prompt to Gemma3: '${userPrompt}'`);

    const assistantResponse = await chatWithGemma3(userPrompt);

    console.log("\nAssistant's Response:");
    console.log(assistantResponse);

    console.log("\n\nTo try a different prompt, run the script again or modify the userPrompt variable.");
}

main();
