# Hugging Face Hub API Examples in Ruby

# This script will demonstrate:
# 1. Listing models from Hugging Face Hub using REST API.
# 2. Getting detailed information for a specific model using REST API.
# 3. Downloading a file (e.g., config.json) from a model repository using REST API.

require 'net/http'
require 'json'
require 'uri'
require 'fileutils' # For creating directories and saving files

HF_API_BASE_URL = 'https://huggingface.co/api'

# Helper function to make GET requests
def http_get(uri_str)
  uri = URI.parse(uri_str)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = (uri.scheme == 'https')
  request = Net::HTTP::Get.new(uri.request_uri)
  # No token needed for public model listing/info for now
  # request['Authorization'] = "Bearer YOUR_HF_TOKEN" if needed
  response = http.request(request)
  JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess) && response['content-type']&.include?('application/json')
rescue StandardError => e
  puts "HTTP GET Error for \#{uri_str}: \#{e.message}"
  nil
end

def list_top_models_ruby(limit = 10)
  puts "Fetching top \#{limit} models from Hugging Face Hub (Ruby)..."
  api_url = "\#{HF_API_BASE_URL}/models?sort=downloads&direction=-1&limit=\#{limit}"
  models_data = http_get(api_url)
  if models_data && models_data.is_a?(Array)
    puts "  Top \#{models_data.length} models (by downloads):"
    models_data.each_with_index do |model, i|
      # Ensure model is a hash and has 'id' before trying to access
      if model.is_a?(Hash)
        model_id_val = model.key?('id') ? model['id'] : (model.key?('modelId') ? model['modelId'] : 'N/A') # modelId is common too
        author_val = model.key?('author') ? model['author'] : 'N/A'
        downloads_val = model.key?('downloads') ? model['downloads'].to_s.reverse.gsub(/(\d{3})(?=\d)/, '\1,').reverse : 'N/A'
        puts "    \#{i + 1}. ID: \#{model_id_val}, Author: \#{author_val}, Downloads: \#{downloads_val}"
      else
        puts "    \#{i + 1}. Error: Model data is not in expected format: \#{model.inspect}"
      end
    end
  elsif models_data # It's not an array, maybe an error object from HF API
    puts "  Could not fetch models, received: \#{models_data.inspect}"
  else
    puts '  No models found or an error occurred during the API call.'
  end
end

def get_model_details_ruby(model_id = "gpt2")
  puts "Fetching details for model: \#{model_id} (Ruby)..."
  model_id_uri_safe = URI.encode_www_form_component(model_id) # Ensure model_id is safe for URI
  api_url = "\#{HF_API_BASE_URL}/models/\#{model_id_uri_safe}"
  info = http_get(api_url)
  if info && info.is_a?(Hash)
    puts "  Details for model: \#{info['modelId'] || info['id'] || model_id}" # Use 'modelId' or 'id' if available
    puts "    Author: \#{info['author']}" if info['author']
    puts "    Downloads: \#{info['downloads'].to_s.reverse.gsub(/(\d{3})(?=\d)/, '\1,').reverse}" if info.key?('downloads')
    puts "    Likes: \#{info['likes'].to_s.reverse.gsub(/(\d{3})(?=\d)/, '\1,').reverse}" if info.key?('likes')
    puts "    Last Modified: \#{info['lastModified']}" if info['lastModified']
    tags = info['tags']&.join(', ') # Safely join tags if they exist and is an array
    puts "    Tags: \#{tags}" if tags && !tags.empty?
    # The REST API for model info might not directly include the full model card/README.
    # This often requires a separate download of the README.md file.
    puts "    (Model card/README content would require a separate download, e.g., of README.md)"
  elsif info # It's not a hash, maybe an error object from HF API
    puts "  Could not retrieve details for \#{model_id}, received: \#{info.inspect}"
  else
    puts "  Error fetching model details for \#{model_id} or no data returned."
  end
end

def download_model_config_file_ruby(model_id = "gpt2", filename = "config.json", local_dir = "downloaded_files_ruby")
  puts "Downloading '\#{filename}' for model '\#{model_id}' to '\#{local_dir}/' (Ruby)..."
  # Add implementation here: GET https://huggingface.co/#{model_id}/resolve/main/#{filename} (or /raw/main/)
end

if __FILE__ == $0
  puts "Hugging Face API Examples (Ruby)"
  puts "------------------------------------"

  # Example calls (will be implemented later)
  list_top_models_ruby(5)
  puts "\n------------------------------------\n"
  get_model_details_ruby("bert-base-uncased")
  # puts "\n------------------------------------\n"
  # download_model_config_file_ruby("distilbert-base-uncased", "config.json", "hf_distilbert_config_ruby")

  puts "\nUncomment function calls in __main__ to run examples after implementation."
end
