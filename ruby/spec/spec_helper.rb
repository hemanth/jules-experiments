require 'webmock/rspec'
require_relative '../ollama/ollama_gemma3' # Adjust path to the script

WebMock.disable_net_connect!(allow_localhost: true) # Allow localhost for integration tests, disable others

RSpec.configure do |config|
  config.filter_run_excluding :integration unless ENV['INTEGRATION_TESTS'] == 'true'

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
end
