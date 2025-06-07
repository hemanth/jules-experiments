# Node.js Ollama Gemma3 Example

This directory contains a Node.js script to interact with the Gemma3 model via a locally running Ollama instance. It uses the official `openai` npm package.

## Prerequisites

- Node.js v18+ (or a version that supports ES modules and top-level await, as used in the example)
- npm (usually comes with Node.js)
- Ollama installed and running. You can download it from [https://ollama.com/](https://ollama.com/).
- Gemma3 model pulled in Ollama:
  ```bash
  ollama pull gemma3
  ```
- An environment variable `OLLAMA_HOST` can be set if your Ollama instance is not running on `http://localhost:11434`.

## Setup

1.  Navigate to this `node` directory.
2.  Install the required dependencies:
    ```bash
    npm install
    ```

## Running the Example

Execute the script:

```bash
npm start
```
or
```bash
node ollama_gemma3.js
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `userPrompt` variable in the script to ask different questions.
