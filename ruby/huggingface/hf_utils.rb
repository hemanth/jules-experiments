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
  begin
    # Ensure model_id and filename are safe for URI construction
    model_id_safe = URI.encode_www_form_component(model_id)
    filename_safe = URI.encode_www_form_component(filename)

    # Construct the direct download URL (often via /resolve/main/ or /raw/main/)
    # Using /resolve/main/ is generally more robust as it resolves to the actual commit hash for main.
    file_url = "https://huggingface.co/\#{model_id_safe}/resolve/main/\#{filename_safe}"
    uri = URI.parse(file_url)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    # Allow redirects, as /resolve/ often redirects to a blob URL
    # http.max_redirects = 5 # This is not a standard Net::HTTP attribute. Manual redirect handling is needed.

    request = Net::HTTP::Get.new(uri.request_uri)
    # No token needed for public files for now
    # request['Authorization'] = "Bearer YOUR_HF_TOKEN" if needed

    response = http.request(request)

    # Manual redirect handling
    redirect_limit = 5
    while response.is_a?(Net::HTTPRedirection) && redirect_limit > 0
      redirect_uri_str = response['location']
      redirect_uri = URI.parse(redirect_uri_str)
      unless redirect_uri.host
        redirect_uri = uri + redirect_uri_str # Handle relative redirect
      end
      puts "  Redirected to: \#{redirect_uri}"

      new_http = Net::HTTP.new(redirect_uri.host, redirect_uri.port)
      new_http.use_ssl = (redirect_uri.scheme == 'https')
      new_request = Net::HTTP::Get.new(redirect_uri.request_uri)
      # Potentially copy over headers like Authorization if needed for private repos
      # new_request['Authorization'] = request['Authorization'] if request['Authorization']
      response = new_http.request(new_request)
      uri = redirect_uri # Update original URI for next potential relative redirect
      redirect_limit -= 1
    end

    if response.is_a?(Net::HTTPSuccess)
      # Ensure local directory exists
      FileUtils.mkdir_p(local_dir) unless File.directory?(local_dir)
      # Sanitize filename from path for local saving, or use the provided filename directly
      local_filename = filename.split('/').last || 'downloaded_hf_file'
      local_file_path = File.join(local_dir, local_filename)

      File.open(local_file_path, 'wb') do |file|
        file.write(response.body)
      end
      puts "  Successfully downloaded '\#{filename}' to '\#{local_file_path}'"

      # Optionally, display a preview of the downloaded file (if text-based)
      if ['.json', '.txt', '.md', '.py', '.js', '.ts', '.rb'].any? { |ext| filename.downcase.end_with?(ext) }
        begin
          content_preview = File.read(local_file_path, 200, encoding: 'UTF-8') # Preview first 200 bytes
          puts "    Preview of \#{local_filename}:\n      \#{content_preview.gsub(/\n/, '\n      ')}..."
        rescue StandardError => e_read
          puts "    Could not read preview of \#{local_filename} (may not be text): \#{e_read.message}"
        end
      end
    else
      puts "  Error downloading file: \#{response.code} \#{response.message} - Body: \#{response.body[0..200]}..."
    end
  rescue StandardError => e
    puts "  Error during download for '\#{filename}' of model '\#{model_id}': \#{e.message}"
    e.backtrace.first(5).each { |line| puts "    \#{line}" }
  end
end

if __FILE__ == $0
  puts "Hugging Face API Examples (Ruby)"
  puts "------------------------------------"

  list_top_models_ruby(5)
  puts "\n------------------------------------\n"
  get_model_details_ruby("bert-base-uncased")
  puts "\n------------------------------------\n"
  download_model_config_file_ruby("distilbert-base-uncased", "config.json", "hf_distilbert_config_ruby")

  puts "\nAll example functions implemented and called."
end
