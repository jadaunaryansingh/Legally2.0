
import os
import traceback
from langchain_huggingface import HuggingFaceEndpoint

# Try with a dummy token if none exists, just to see if it instantiates
token = os.getenv("HF_TOKEN", "hf_dummy_token_for_testing")
print(f"Testing with token: {token[:4]}...")

try:
    llm = HuggingFaceEndpoint(
        repo_id="AdaptLLM/law-LLM",
        task="text-generation",
        huggingfacehub_api_token=token
    )
    print("Endpoint created successfully.")
    
    print("Attempting invocation...")
    response = llm.invoke("Hello")
    print("Invocation successful:", response)
    
except Exception:
    traceback.print_exc()
