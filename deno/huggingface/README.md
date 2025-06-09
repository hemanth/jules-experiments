# Deno Hugging Face Hub API Examples

This directory contains Deno (TypeScript) scripts demonstrating how to interact with the Hugging Face Hub API using Deno's built-in `fetch` API for REST calls and standard library modules.

The examples cover:
1.  Listing models from the Hub.
2.  Fetching detailed metadata for a specific model.
3.  Downloading a file (e.g., `config.json`) from a model's repository.

## Prerequisites

- Deno CLI installed. You can find installation instructions at [https://deno.land/](https://deno.land/).
- Internet access for API calls.

## Setup

No external package installation is needed beyond Deno itself, as the script uses built-in APIs and standard library modules (imported via URL).

## Running the Examples

The script `huggingface/hf_utils.ts` contains all the examples.

To run the script and see the output of the implemented examples, you need to grant necessary permissions:
- `--allow-net` for making HTTP requests to the Hugging Face API.
- `--allow-env` for potentially reading environment variables (like `HF_TOKEN`, though not explicitly used for reading in these public examples).
- `--allow-write` for saving downloaded files.
- `--allow-read` for Deno to access the script itself.

Execute from the `deno` directory (parent of `huggingface`):
```bash
deno run --allow-net --allow-env --allow-write --allow-read huggingface/hf_utils.ts
```

By default, the script has example calls uncommented in its main execution block (`if (import.meta.main)`). You can modify these calls to experiment with different models or parameters.

### Example Functions:

*   `listTopModelsDeno(limit=10)`: Lists the top N models by downloads.
    *   Example call in script: `await listTopModelsDeno(5);`
*   `getModelDetailsDeno(modelId="gpt2")`: Fetches and displays information for the specified `model_id`.
    *   Example call in script: `await getModelDetailsDeno("bert-base-uncased");`
*   `downloadModelConfigFileDeno(model_id="gpt2", filename="config.json", localDir="downloaded_files_deno")`: Downloads the specified `filename` from the `model_id` repository into the `localDir` (created if it doesn't exist within `deno/huggingface/`).
    *   Example call in script: `await downloadModelConfigFileDeno("distilbert-base-uncased", "config.json", "hf_distilbert_config_deno");`

### Hugging Face Hub Token (Optional)

The examples are designed to work with public models and anonymous access to the REST API. For higher rate limits or to access private models, you would typically include an Authorization header with a Hugging Face Hub token in your `fetch` requests:

```typescript
// const response = await fetch(uri, {
//     headers: { 'Authorization': 'Bearer YOUR_HF_TOKEN' }
// });
```
You would need to modify the `httpGet` helper or specific `fetch` calls to include this.

The script will create a subdirectory (e.g., `hf_distilbert_config_deno`) inside `deno/huggingface/` to store downloaded files.
