# Ruby Ollama Gemma3 Example

This directory contains a Ruby script to interact with the Gemma3 model via a locally running Ollama instance. It uses Ruby's built-in `net/http` library.

## Prerequisites

- Ruby 2.5+
- Ollama installed and running. You can download it from [https://ollama.com/](https://ollama.com/).
- Gemma3 model pulled in Ollama:
  ```bash
  ollama pull gemma3
  ```
- An environment variable `OLLAMA_HOST` can be set if your Ollama instance is not running on `http://localhost:11434`.

## Setup

No external gems are required beyond standard Ruby libraries.

## Running the Example

Navigate to this `ruby` directory and execute the script:

```bash
ruby ollama_gemma3_example.rb
```

The script will send a predefined prompt to the Gemma3 model and print its response. You can modify the `user_prompt` variable in the script to ask different questions.
