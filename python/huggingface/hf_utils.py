# Hugging Face Hub API Examples in Python

# This script will demonstrate:
# 1. Listing models from Hugging Face Hub.
# 2. Getting detailed information for a specific model.
# 3. Downloading a file (e.g., config.json) from a model repository.

# Ensure you have the 'huggingface_hub' library installed:
# pip install huggingface_hub

import os
from huggingface_hub import list_models, model_info, hf_hub_download

def list_top_models(limit=10):
    """Lists the top N models from Hugging Face Hub."""
    print(f"Fetching top {limit} models from Hugging Face Hub...")
    try:
        # Fetch top N models, sorted by downloads in descending order
        models = list(list_models(sort='downloads', direction=-1, limit=limit))
        if not models:
            print('  No models found or an issue occurred.')
            return
        print(f'  Top {len(models)} models (by downloads):')
        for i, model in enumerate(models):
            print(f'    {i+1}. ID: {model.modelId}, Author: {model.author}, Downloads: {model.downloads:,}')
    except Exception as e:
        print(f'  Error listing models: {e}')

def get_model_details(model_id="gpt2"):
    """Fetches and displays information for a specific model ID."""
    print(f"Fetching details for model: {model_id}...")
    try:
        info = model_info(model_id)
        if not info:
            print(f'  Could not retrieve info for model: {model_id}')
            return
        print(f'  Details for model: {info.modelId}')
        print(f'    Author: {info.author}')
        print(f'    Downloads: {info.downloads:,}')
        print(f'    Likes: {info.likes:,}')
        print(f'    Last Modified: {info.lastModified}')
        print(f'    Tags: {info.tags}')
        # Display first few lines of the model card (README) if available
        if hasattr(info, 'cardData') and info.cardData and 'content' in info.cardData: # cardData might be None or miss 'content'
            card_content = info.cardData['content']
            print(f'    Model Card (first 200 chars):\n      {card_content[:200].replace("\n", "\n      ")}...')
        elif hasattr(info, 'readme') and info.readme: # Fallback for older huggingface_hub or if cardData is not populated but readme is
            print(f'    Model Card (first 200 chars from readme):\n      {info.readme[:200].replace("\n", "\n      ")}...')
        else:
            print('    Model card/readme content not readily available in model_info response.')
    except Exception as e:
        print(f'  Error fetching model details for {model_id}: {e}')

def download_model_config_file(model_id="gpt2", filename="config.json", local_dir="downloaded_files"):
    """Downloads a specific file from a model repository to a local directory."""
    print(f"Downloading '{filename}' for model '{model_id}' to '{local_dir}/'...")
    try:
        # Ensure the local directory exists
        os.makedirs(local_dir, exist_ok=True)
        downloaded_file_path = hf_hub_download(
            repo_id=model_id,
            filename=filename,
            local_dir=local_dir,
            local_dir_use_symlinks=False, # Recommended to avoid issues with symlinks, especially on Windows
            # force_download=True, # Uncomment to always re-download
        )
        print(f"  Successfully downloaded '{filename}' to '{downloaded_file_path}'")
        # You can optionally print the first few lines of the downloaded file
        try:
            with open(downloaded_file_path, 'r', encoding='utf-8') as f:
                content_preview = f.read(200) # Read first 200 chars
            print(f"    Preview of {filename}:\n      {content_preview.replace চুপ '\n', '\n      ')}...")
        except Exception as e_read:
            print(f"    Could not read preview of {filename}: {e_read}")
    except Exception as e:
        print(f"  Error downloading file '{filename}' for model '{model_id}': {e}")

if __name__ == "__main__":
    print("Hugging Face API Examples (Python)")
    print("------------------------------------")

    list_top_models(5)
    print("\n------------------------------------\n")
    get_model_details("bert-base-uncased")
    print("\n------------------------------------\n")
    download_model_config_file(model_id="distilbert-base-uncased", filename="config.json", local_dir="hf_distilbert_config")

    print("\nAll example functions implemented and called.")
