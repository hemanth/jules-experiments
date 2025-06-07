# Deno Ollama Gemma3 Example

This directory contains a Deno (TypeScript) script (`ollama/ollama_gemma3.ts`) to interact with the Gemma3 model via a locally running Ollama instance. It uses the built-in Fetch API.

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

Navigate to this `deno` directory and execute the script (`ollama/ollama_gemma3.ts`):

To run the script, you'll need to grant network access permission (to connect to Ollama) and environment variable read permission (for `OLLAMA_HOST`):

```bash
deno run --allow-net --allow-env ollama/ollama_gemma3.ts
```

Alternatively, to allow all permissions (less secure, use with caution):
```bash
deno run -A ollama/ollama_gemma3.ts
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `userPrompt` variable in the script to ask different questions.

## Running Tests

Tests are written using Deno's built-in test runner and standard library for assertions and mocking.

1.  **Run All Tests**:
    From within the `deno` directory, you can run all test files (e.g., `*.test.ts` in the `tests/` subdirectory):
    ```bash
    deno test --allow-net --allow-env
    ```
    -   `--allow-net` is required for integration tests to connect to the Ollama service.
    -   `--allow-env` is required for both unit and integration tests to read the `OLLAMA_HOST` environment variable.
    -   `--allow-read` is implicitly needed by tests to import modules; Deno handles this for test files.

2.  **Run Only Unit Tests**:
    To run only the unit tests, specify the unit test file. Unit tests mock network requests and do not require a live Ollama instance.
    ```bash
    deno test --allow-env --allow-read tests/ollama_gemma3_unit.test.ts
    ```
    -   `--allow-env` is needed because the `ollama_gemma3.ts` script reads `OLLAMA_HOST` upon import.
    -   `--allow-read` grants permission to read the test file and the script it imports.
    -   `--allow-net` is generally not needed if mocks are correctly implemented and cover all network interactions.

3.  **Run Only Integration Tests**:
    Integration tests require a running Ollama instance.
    ```bash
    deno test --allow-net --allow-env tests/ollama_gemma3_integration.test.ts
    ```
    **Note**: Integration tests are designed to check for Ollama's availability and will skip themselves if the instance (specified by `OLLAMA_HOST`) is not reachable. You'll see console messages indicating this.

All test commands should be run from the root of the `deno` directory. If running from the project root, adjust paths accordingly (e.g., `deno test --allow-net --allow-env deno/tests/`).
