# Python Hugging Face Hub API Examples

This directory contains Python scripts demonstrating how to interact with the Hugging Face Hub API using the `huggingface_hub` library.

The examples cover:
1.  Listing models from the Hub.
2.  Fetching detailed metadata for a specific model.
3.  Downloading a file (e.g., `config.json`) from a model's repository.

## Prerequisites

- Python 3.7+
- The `huggingface_hub` library.

## Setup

1.  **Navigate to the `python` directory** (parent of this `huggingface` directory).
    ```bash
    cd ..
    # Or ensure you are in the 'jules-experiments/python' directory
    ```
2.  **Install dependencies** from the main `python` directory's `requirements.txt` (which includes `huggingface_hub`):
    ```bash
    pip install -r requirements.txt
    ```
    If you only want to install `huggingface_hub` directly:
    ```bash
    pip install huggingface_hub
    ```

## Running the Examples

The script `huggingface/hf_utils.py` contains all the examples.

To run the script and see the output of the implemented examples:
```bash
python huggingface/hf_utils.py
```

By default, the script has example calls uncommented in its `if __name__ == "__main__":` block. You can modify these calls to experiment with different models or parameters.

### Example Functions:

*   `list_top_models(limit=10)`: Lists the top N models by downloads.
    *   Example: `list_top_models(5)`
*   `get_model_details(model_id="gpt2")`: Fetches and displays information for the specified `model_id`.
    *   Example: `get_model_details("bert-base-uncased")`
*   `download_model_config_file(model_id="gpt2", filename="config.json", local_dir="downloaded_files")`: Downloads the specified `filename` from the `model_id` repository into the `local_dir` (created if it doesn't exist).
    *   Example: `download_model_config_file(model_id="distilbert-base-uncased", filename="config.json", local_dir="hf_distilbert_config")`

### Hugging Face Hub Token (Optional)

The examples are designed to work with public models and anonymous access. For higher rate limits, or to access private models or download very large files more reliably, you might need to log in using a Hugging Face Hub token:

-   **Login via CLI**:
    ```bash
    huggingface-cli login
    ```
    Or set the `HF_TOKEN` environment variable.
-   Refer to the [huggingface_hub documentation](https://huggingface.co/docs/huggingface_hub/quick-start#login) for more details.

The script will create a subdirectory (e.g., `hf_distilbert_config` or `downloaded_files`) in the `python/huggingface/` directory to store downloaded files.
