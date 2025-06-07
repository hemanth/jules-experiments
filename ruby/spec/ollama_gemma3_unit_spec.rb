require 'spec_helper'

describe '#chat_with_gemma3' do
  let(:ollama_host) { ENV['OLLAMA_HOST'] || 'http://localhost:11434' }
  let(:chat_url) { "\#{ollama_host}/v1/chat/completions" }
  let(:prompt) { 'Test prompt for unit test' }

  before do
    # Ensure OLLAMA_HOST is set for WebMock to correctly stub requests if it's used in the URL construction
    stub_const("OLLAMA_HOST", ollama_host)
  end

  context 'when the API call is successful' do
    before do
      stub_request(:post, chat_url)
        .with(
          body: { model: 'gemma3', messages: [{role: 'system', content: 'You are a helpful assistant.'}, {role: 'user', content: prompt}], stream: false }.to_json,
          headers: {'Content-Type'=>'application/json'}
        )
        .to_return(
          status: 200,
          body: { choices: [{ message: { content: 'Mocked response' } }] }.to_json,
          headers: {'Content-Type'=>'application/json'}
        )
    end

    it 'returns the content from the response' do
      expect(chat_with_gemma3(prompt)).to eq('Mocked response')
    end
  end

  context 'when the API returns an error status' do
    before do
      stub_request(:post, chat_url)
        .to_return(status: 500, body: 'Server Error', headers: {})
    end

    it 'returns an error message' do
      expect(chat_with_gemma3(prompt)).to include('Error: 500 Internal Server Error')
    end
  end

  context 'when a network error occurs' do
    before do
      stub_request(:post, chat_url).to_raise(SocketError.new('Failed to open TCP connection'))
    end

    it 'returns an error message' do
      expect(chat_with_gemma3(prompt)).to include('Error communicating with Ollama: Failed to open TCP connection')
    end
  end

  context 'when the API response is malformed (e.g., not JSON)' do
    before do
      stub_request(:post, chat_url)
        .to_return(status: 200, body: 'Not JSON', headers: {'Content-Type'=>'text/plain'})
    end

    it 'returns an error message indicating parsing failure' do
      # The current script's JSON.parse will raise JSON::ParserError
      expect(chat_with_gemma3(prompt)).to include('Error communicating with Ollama:')
    end
  end

  context 'when the API response JSON is missing expected fields' do
    before do
      stub_request(:post, chat_url)
        .to_return(
          status: 200,
          body: { data: 'no choices here' }.to_json, # Missing 'choices'
          headers: {'Content-Type'=>'application/json'}
        )
    end

    it 'returns an error message about parsing or missing fields' do
        expect(chat_with_gemma3(prompt)).to include('Error: Could not parse response from Ollama.')
    end
  end
end
