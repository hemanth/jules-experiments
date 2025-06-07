# Ruby Ollama Gemma3 Example

This directory contains a Ruby script (`ollama/ollama_gemma3.rb`) to interact with the Gemma3 model via a locally running Ollama instance. It uses Ruby's built-in `net/http` library for the main script, and RSpec/WebMock for tests.

## Prerequisites

- Ruby 2.5+
- Bundler (Ruby gem manager): `gem install bundler`
- Ollama installed and running. You can download it from [https://ollama.com/](https://ollama.com/).
- Gemma3 model pulled in Ollama:
  ```bash
  ollama pull gemma3
  ```
- An environment variable `OLLAMA_HOST` can be set if your Ollama instance is not running on `http://localhost:11434`.

## Setup

1.  Navigate to this `ruby` directory.
2.  Install required gems (for running the script and tests):
    ```bash
    bundle install
    ```

## Running the Example

Navigate to this `ruby` directory and execute the script:

```bash
ruby ollama/ollama_gemma3.rb
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `user_prompt` variable in the script to ask different questions.

## Running Tests

Tests are written using RSpec and WebMock.

1.  **Install Test Dependencies**:
    Ensure you have installed all gem dependencies by running from the `ruby` directory:
    ```bash
    bundle install
    ```

2.  **Run All Tests**:
    From within the `ruby` directory, you can run all RSpec tests:
    ```bash
    bundle exec rspec
    ```
    By default, this will run unit tests. Integration tests (tagged `:integration`) will be skipped unless the `INTEGRATION_TESTS=true` environment variable is set, as configured in `spec/spec_helper.rb`.

3.  **Run Only Unit Tests**:
    To explicitly run only the unit tests (which do not require a live Ollama instance):
    ```bash
    bundle exec rspec spec/ollama_gemma3_unit_spec.rb
    ```
    Alternatively, to run all tests *not* tagged as `integration`:
    ```bash
    bundle exec rspec --tag ~integration
    ```

4.  **Run Only Integration Tests**:
    Integration tests require a running Ollama instance and the `INTEGRATION_TESTS=true` environment variable to be set.
    To run only integration tests:
    ```bash
    INTEGRATION_TESTS=true bundle exec rspec spec/ollama_gemma3_integration_spec.rb
    ```
    Or more broadly to run any test tagged with `integration`:
    ```bash
    INTEGRATION_TESTS=true bundle exec rspec --tag integration
    ```
    **Note**: Integration tests will be automatically skipped by the test suite if the Ollama instance is not detected or if `INTEGRATION_TESTS=true` is not set. You will see messages indicating this if they are skipped.
