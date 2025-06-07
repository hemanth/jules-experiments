require 'net/http'
require 'json'
require 'uri'

# Get Ollama host from environment variable or use default
OLLAMA_HOST = ENV['OLLAMA_HOST'] || 'http://localhost:11434'

def chat_with_gemma3(prompt)
  uri = URI.parse("#{OLLAMA_HOST}/v1/chat/completions")

  header = {'Content-Type': 'application/json'}
  payload = {
    model: "gemma3",
    messages: [
      {role: "system", content: "You are a helpful assistant."},
      {role: "user", content: prompt}
    ],
    stream: false # Ensure we get a complete response, not a stream
  }

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = (uri.scheme == 'https')

  request = Net::HTTP::Post.new(uri.request_uri, header)
  request.body = payload.to_json

  begin
    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      return "Error: #{response.code} #{response.message}\n#{response.body}"
    end

    response_body = JSON.parse(response.body)

    if response_body['choices'] && response_body['choices'][0] && response_body['choices'][0]['message'] && response_body['choices'][0]['message']['content']
      return response_body['choices'][0]['message']['content']
    else
      return "Error: Could not parse response from Ollama. Response: #{response.body}"
    end

  rescue StandardError => e
    return "Error communicating with Ollama: #{e.message}"
  end
end

if __FILE__ == $0
  puts "Attempting to connect to Ollama..."
  # Test connection by trying to list models (a lightweight GET request)
  begin
    test_uri = URI.parse("#{OLLAMA_HOST}/api/tags") # Corresponds to `ollama list`
    test_http = Net::HTTP.new(test_uri.host, test_uri.port)
    test_http.use_ssl = (test_uri.scheme == 'https')
    test_request = Net::HTTP::Get.new(test_uri.request_uri)
    test_response = test_http.request(test_request)

    if test_response.is_a?(Net::HTTPSuccess)
      puts "Successfully connected to Ollama."
    else
      puts "Failed to connect to Ollama at #{OLLAMA_HOST}."
      puts "Error: #{test_response.code} #{test_response.message}"
      puts "\nPlease ensure Ollama is running and the OLLAMA_HOST environment variable is set correctly if not using the default."
      exit 1
    end
  rescue StandardError => e
    puts "Failed to connect to Ollama at #{OLLAMA_HOST}."
    puts "Error details: #{e.message}"
    puts "\nPlease ensure Ollama is running and the OLLAMA_HOST environment variable is set correctly if not using the default."
    exit 1
  end

  user_prompt = "Ruby is known for being developer-friendly. Can you give three reasons why?"
  puts "\nSending prompt to Gemma3: '#{user_prompt}'"

  assistant_response = chat_with_gemma3(user_prompt)

  puts "\nAssistant's Response:"
  puts assistant_response

  puts "\n\nTo try a different prompt, run the script again or modify the user_prompt variable."
end
