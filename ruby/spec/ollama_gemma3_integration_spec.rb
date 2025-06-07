require 'spec_helper'

describe 'Ollama Gemma3 Integration', :integration do
  # Check if Ollama is available by making a lightweight request
  # This is a simplified check. A more robust check might be needed.
  ollama_uri = URI.parse((ENV['OLLAMA_HOST'] || 'http://localhost:11434') + '/api/tags')
  begin
    response = Net::HTTP.get_response(ollama_uri)
    OLLAMA_READY = response.is_a?(Net::HTTPSuccess)
    puts "Ollama integration spec: Ollama appears to be READY." if OLLAMA_READY
  rescue SocketError, Errno::ECONNREFUSED
    OLLAMA_READY = false
    puts "Ollama integration spec: Ollama appears to be NOT READY."
  end

  unless OLLAMA_READY
    puts 'Skipping Ollama integration tests because Ollama is not reachable.'
  end

  before(:each) do
    skip('Ollama not available for integration tests') unless OLLAMA_READY
  end

  describe '#chat_with_gemma3 (integration)' do
    it 'returns a non-empty string for a simple prompt' do
      prompt = "What is the color of the sky on a clear day? Respond briefly."
      response = chat_with_gemma3(prompt)
      expect(response).to be_a(String)
      expect(response).not_to be_empty
      expect(response).not_to include('Error:')
      puts "Ruby integration test prompt: '\#{prompt}', Response: '\#{response[0..50]}...'"
    end
  end

  describe 'Ollama Connection Test (main block equivalent)' do
    it 'can connect and list tags (models)' do
      uri = URI.parse("\#{(ENV['OLLAMA_HOST'] || 'http://localhost:11434')}/api/tags")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == 'https')
      request = Net::HTTP::Get.new(uri.request_uri)

      response = http.request(request)

      expect(response).to be_a(Net::HTTPSuccess)
      body = JSON.parse(response.body)
      expect(body).to have_key('models')
      expect(body['models']).to be_an(Array)
      puts "Ruby integration test: Successfully listed models. Found \#{body['models'].length}."
    end
  end
end
