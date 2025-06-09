# Ruby Hugging Face Hub API Examples

This directory contains Ruby scripts demonstrating how to interact with the Hugging Face Hub API using Ruby's built-in `net/http` and `json` libraries for REST calls.

The examples cover:
1.  Listing models from the Hub.
2.  Fetching detailed metadata for a specific model.
3.  Downloading a file (e.g., `config.json`) from a model's repository.

## Prerequisites

- Ruby 2.5+
- No external gems are strictly required beyond standard libraries (`net/http`, `json`, `fileutils`).

## Setup

Ensure you have Ruby installed. No additional gem installation is needed to run these basic examples.

## Running the Examples

The script `huggingface/hf_utils.rb` contains all the examples.

To run the script and see the output of the implemented examples:
```bash
ruby huggingface/hf_utils.rb
```

By default, the script has example calls uncommented in its main execution block (`if __FILE__ == $0`). You can modify these calls to experiment with different models or parameters.

### Example Functions:

*   `list_top_models_ruby(limit=10)`: Lists the top N models by downloads.
    *   Example call in script: `list_top_models_ruby(5)`
*   `get_model_details_ruby(model_id="gpt2")`: Fetches and displays information for the specified `model_id`.
    *   Example call in script: `get_model_details_ruby("bert-base-uncased")`
*   `download_model_config_file_ruby(model_id="gpt2", filename="config.json", local_dir="downloaded_files_ruby")`: Downloads the specified `filename` from the `model_id` repository into the `local_dir` (created if it doesn't exist within `ruby/huggingface/`).
    *   Example call in script: `download_model_config_file_ruby("distilbert-base-uncased", "config.json", "hf_distilbert_config_ruby")`

### Hugging Face Hub Token (Optional)

The examples are designed to work with public models and anonymous access to the REST API. For higher rate limits, or to access private models or perform actions requiring authentication, you would typically include an Authorization header with a Hugging Face Hub token in your HTTP requests:

```ruby
# request['Authorization'] = "Bearer YOUR_HF_TOKEN"
```
You would need to uncomment and set this in the `http_get` helper or in specific request setups.

The script will create a subdirectory (e.g., `hf_distilbert_config_ruby`) inside `ruby/huggingface/` to store downloaded files.
