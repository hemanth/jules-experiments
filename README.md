# Jule Experiments

This repository contains various experiments conducted by Jule. It includes sample code for different programming languages demonstrating interactions with AI models, and potentially other experimental projects.

## Language Samples for Ollama Gemma3

This repository includes examples of how to connect to a locally running Ollama instance and interact with the Gemma3 large language model.

### General Prerequisites for Ollama & Gemma3

1.  **Install Ollama**: Download and install Ollama from [https://ollama.com/](https://ollama.com/).
2.  **Pull the Gemma3 model**: Once Ollama is running, pull the Gemma3 model by running the following command in your terminal:
    ```bash
    ollama pull gemma3
    ```
3.  **Ollama Host**: The sample scripts assume Ollama is running at `http://localhost:11434`. If your Ollama instance is hosted elsewhere (e.g., in a Docker container with a different port mapping), you can usually set the `OLLAMA_HOST` environment variable to point to the correct address before running the scripts. For example:
    ```bash
    export OLLAMA_HOST="http://127.0.0.1:your_port"
    ```

### Available Language Examples

Below is a list of directories containing language-specific examples. Each directory has its own `README.md` with detailed setup and execution instructions.

*   **[Python](./python/)**: Contains a Python script (`ollama/ollama_gemma3.py`) using the `openai` library to connect to Ollama.
    *   [Go to Python README](./python/README.md)
*   **[Ruby](./ruby/)**: Contains a Ruby script (`ollama/ollama_gemma3.rb`) using the built-in `net/http` library.
    *   [Go to Ruby README](./ruby/README.md)
*   **[Node.js](./node/)**: Contains a Node.js script (`ollama/ollama_gemma3.js`) using the `openai` npm package.
    *   [Go to Node.js README](./node/README.md)
*   **[Deno](./deno/)**: Contains a Deno (TypeScript) script (`ollama/ollama_gemma3.ts`) using the native Fetch API.
    *   [Go to Deno README](./deno/README.md)

## Hugging Face Hub API Examples
This repository also provides examples for interacting with the Hugging Face Hub API, demonstrating:
- Listing models.
- Fetching detailed information for specific models.
- Downloading model files (e.g., `config.json`).

These examples are available for Python, Node.js, Ruby, and Deno.

### General Notes for Hugging Face Examples
- The examples primarily use anonymous access to public models and files.
- For increased rate limits or accessing private resources, you might need a Hugging Face Hub token. Refer to the language-specific READMEs in the `huggingface` subdirectories for more details on token usage if applicable.

### Available Hugging Face Language Examples
Each language directory now contains a `huggingface` subdirectory with its own script and `README.md`:

*   **[Python (Hugging Face)](./python/huggingface/)**: Uses the `huggingface_hub` library.
    *   Script: `python/huggingface/hf_utils.py`
    *   [Go to Python Hugging Face README](./python/huggingface/README.md)
*   **[Node.js (Hugging Face)](./node/huggingface/)**: Uses the `@huggingface/hub` npm package.
    *   Script: `node/huggingface/hf_utils.js`
    *   [Go to Node.js Hugging Face README](./node/huggingface/README.md)
*   **[Ruby (Hugging Face)](./ruby/huggingface/)**: Uses Ruby's `net/http` for REST API calls.
    *   Script: `ruby/huggingface/hf_utils.rb`
    *   [Go to Ruby Hugging Face README](./ruby/huggingface/README.md)
*   **[Deno (Hugging Face)](./deno/huggingface/)**: Uses Deno's `fetch` API for REST calls.
    *   Script: `deno/huggingface/hf_utils.ts`
    *   [Go to Deno Hugging Face README](./deno/huggingface/README.md)

## Contributing

Details on contributing to this repository will be added here in the future. For now, if you have suggestions or find issues with the examples, please open an issue in the repository.

## License

This repository is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
