# Node.js Ollama Gemma3 Example

This directory contains a Node.js script (`ollama/ollama_gemma3.js`) to interact with the Gemma3 model via a locally running Ollama instance. It uses the official `openai` npm package.

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
2.  Install the required dependencies (including development dependencies for testing):
    ```bash
    npm install
    ```

## Running the Example

Execute the script from the `node` directory:

```bash
node ollama/ollama_gemma3.js
```
Alternatively, you can use the start script defined in `package.json`:
```bash
npm start
```
This will execute `node ollama/ollama_gemma3.js`.

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `userPrompt` variable in the script to ask different questions.

## Running Tests

Tests are written using Jest.

1.  **Install Dependencies**:
    Ensure you have installed all dependencies, including development dependencies for testing. From the `node` directory:
    ```bash
    npm install
    ```

2.  **Run All Tests**:
    From within the `node` directory, you can run all tests (both unit and integration) using the test script defined in `package.json`:
    ```bash
    npm test
    ```

3.  **Run Only Unit Tests**:
    To run only the unit tests (which do not require a live Ollama instance), you can specify the test file:
    ```bash
    npm test -- ollama_gemma3.test.js
    ```
    Alternatively, using npx:
    ```bash
    npx jest tests/ollama_gemma3.test.js
    ```

4.  **Run Only Integration Tests**:
    Integration tests require a running Ollama instance. To run only integration tests:
    ```bash
    npm test -- ollama_gemma3.integration.test.js
    ```
    Alternatively, using npx:
    ```bash
    npx jest tests/ollama_gemma3.integration.test.js
    ```
    **Note**: Integration tests are designed to skip themselves if a connection to the Ollama instance (specified by `OLLAMA_HOST`) cannot be established. You will see console messages indicating this if they are skipped.
