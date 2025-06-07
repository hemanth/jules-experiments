# Deno Ollama Gemma3 Example

This directory contains a Deno (TypeScript) script to interact with the Gemma3 model via a locally running Ollama instance. It uses the built-in Fetch API.

## Prerequisites

- Deno CLI installed. You can find installation instructions at [https://deno.land/](https://deno.land/).
- Ollama installed and running. You can download it from [https://ollama.com/](https://ollama.com/).
- Gemma3 model pulled in Ollama:
  ```bash
  ollama pull gemma3
  ```
- An environment variable `OLLAMA_HOST` can be set if your Ollama instance is not running on `http://localhost:11434`.

## Setup

No external dependencies need to be installed beyond Deno itself.

## Running the Example

Navigate to this `deno` directory and execute the script:

To run the script, you'll need to grant network access permission and environment variable read permission:

```bash
deno run --allow-net --allow-env ollama_gemma3.ts
```

Alternatively, to allow all permissions (less secure, use with caution):
```bash
deno run -A ollama_gemma3.ts
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `userPrompt` variable in the script to ask different questions.
