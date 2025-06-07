# Node.js Hugging Face Hub API Examples

This directory contains Node.js scripts demonstrating how to interact with the Hugging Face Hub API using the `@huggingface/hub` library.

The examples cover:
1.  Listing models from the Hub.
2.  Fetching detailed metadata for a specific model.
3.  Downloading a file (e.g., `config.json`) from a model's repository.

## Prerequisites

- Node.js v18+ (or a version that supports ES modules and top-level await).
- npm or yarn for installing dependencies.

## Setup

1.  **Navigate to the `node` directory** (parent of this `huggingface` directory).
    ```bash
    cd ..
    # Or ensure you are in the 'jules-experiments/node' directory
    ```
2.  **Install dependencies** from the main `node` directory's `package.json` (which includes `@huggingface/hub`):
    ```bash
    npm install
    # or
    # yarn install
    ```

## Running the Examples

The script `huggingface/hf_api_examples.js` contains all the examples.

To run the script and see the output of the implemented examples:
```bash
node huggingface/hf_api_examples.js
```

By default, the script has example calls uncommented in its `main()` function. You can modify these calls to experiment with different models or parameters.

### Example Functions:

*   `listTopModelsNode(limit=10)`: Lists the top N models by downloads.
    *   Example call in script: `await listTopModelsNode(5);`
*   `getModelDetailsNode(modelId="gpt2")`: Fetches and displays information for the specified `model_id`.
    *   Example call in script: `await getModelDetailsNode("bert-base-uncased");`
*   `downloadModelConfigFileNode(modelId="gpt2", filename="config.json", localDir="downloaded_files_node")`: Downloads the specified `filename` from the `model_id` repository into the `localDir` (created if it doesn't exist within `node/huggingface/`).
    *   Example call in script: `await downloadModelConfigFileNode("distilbert-base-uncased", "config.json", "hf_distilbert_config_node");`

### Hugging Face Hub Token (Optional)

The examples are designed to work with public models and anonymous access. For higher rate limits, or to access private models, you might need to provide an Hugging Face Hub token. The `@huggingface/hub` library functions often accept an `accessToken` or `credentials` option.

-   You can pass a token like: `await listModels({ accessToken: "hf_YOUR_TOKEN" });`
-   Alternatively, logging in via `huggingface-cli login` might make the token available to the library implicitly in some environments, or you can set the `HF_TOKEN` environment variable.
-   Refer to the [@huggingface/hub documentation](https://huggingface.co/docs/huggingface.js/hub/README) for more details on authentication.

The script will create a subdirectory (e.g., `hf_distilbert_config_node`) inside `node/huggingface/` to store downloaded files.
