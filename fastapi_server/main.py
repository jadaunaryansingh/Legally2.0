from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import pathlib
import traceback

# Load .env from the root directory
env_path = pathlib.Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face Configuration
HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = os.getenv("HF_MODEL_ID", "AdaptLLM/law-LLM")

if not HF_TOKEN:
    print("Warning: HF_TOKEN is not set in .env")
else:
    print(f"HF_TOKEN loaded: {HF_TOKEN[:4]}...{HF_TOKEN[-4:]}")

client = InferenceClient(token=HF_TOKEN)

class ChatRequest(BaseModel):
    message: str

@app.get("/api/ping")
def ping():
    return {"message": "ping pong from FastAPI"}

# ---------- Browse Laws Backend ----------
class LawItem(BaseModel):
    id: str
    title: str
    act: str
    section: str | None = None
    summary: str

LAW_ITEMS: list[LawItem] = [
    LawItem(
        id="ipc-302",
        title="Murder",
        act="Indian Penal Code (IPC)",
        section="Section 302",
        summary="Punishment for murder. Death or imprisonment for life, and fine.",
    ),
    LawItem(
        id="ipc-304",
        title="Culpable Homicide Not Amounting to Murder",
        act="Indian Penal Code (IPC)",
        section="Section 304",
        summary="Punishment varies based on intention/knowledge. Imprisonment up to life or up to 10 years and fine.",
    ),
    LawItem(
        id="ipc-379",
        title="Theft",
        act="Indian Penal Code (IPC)",
        section="Section 379",
        summary="Punishment for theft. Imprisonment up to 3 years, or fine, or both.",
    ),
    LawItem(
        id="ipc-323",
        title="Voluntarily Causing Hurt",
        act="Indian Penal Code (IPC)",
        section="Section 323",
        summary="Imprisonment up to 1 year, or fine up to ₹1,000, or both, except in cases under Section 334.",
    ),
    LawItem(
        id="crpc-fir",
        title="First Information Report (FIR)",
        act="Criminal Procedure Code (CrPC)",
        section="Section 154",
        summary="Information relating to cognizable offence recorded by police. Initiates investigation.",
    ),
    LawItem(
        id="evidence-act-65b",
        title="Admissibility of Electronic Records",
        act="Indian Evidence Act",
        section="Section 65B",
        summary="Electronic records are admissible subject to certificate and conditions.",
    ),
    LawItem(
        id="contract-73",
        title="Compensation for Loss or Damage",
        act="Indian Contract Act",
        section="Section 73",
        summary="Damages for breach of contract—loss naturally arising or which parties knew would likely result.",
    ),
]

@app.get("/api/browse/laws")
def browse_laws(page: int = 1, limit: int = 10):
    if page < 1:
        page = 1
    if limit < 1:
        limit = 10
    start = (page - 1) * limit
    end = start + limit
    items = LAW_ITEMS[start:end]
    return {
        "items": [item.dict() for item in items],
        "total": len(LAW_ITEMS),
        "page": page,
        "limit": limit,
    }

@app.post("/api/legal-advice")
def get_legal_advice(request: ChatRequest):
    # Function to try generating response with a specific model
    def try_generate(model_id, prompt_messages, is_chat=True):
        print(f"Attempting to use model: {model_id}")
        try:
            if is_chat:
                response = client.chat_completion(
                    model=model_id,
                    messages=prompt_messages,
                    max_tokens=1000,
                    temperature=0.7
                )
                if response.choices and len(response.choices) > 0:
                    return response.choices[0].message.content
            else:
                # Construct text prompt from messages
                full_prompt = ""
                for msg in prompt_messages:
                    role = msg["role"]
                    content = msg["content"]
                    if role == "system":
                        full_prompt += f"### System:\n{content}\n\n"
                    elif role == "user":
                        full_prompt += f"### User:\n{content}\n\n"
                full_prompt += "### Assistant:\n"
                
                response = client.text_generation(
                    prompt=full_prompt,
                    model=model_id,
                    max_new_tokens=500,
                    temperature=0.7,
                    top_p=0.95,
                    repetition_penalty=1.15,
                    do_sample=True,
                    return_full_text=False
                )
                return response
        except Exception as e:
            print(f"Failed to use model {model_id}: {str(e)}")
            return None

    try:
        print(f"Received request: {request.message}")
        
        # Define the expert legal system prompt
        system_prompt = """You are an expert legal assistant and law professor specialized in Indian Law.
Your goal is to provide accurate, educational, and strictly legal information.
When users ask about crimes, offenses, or punishments, you MUST explain the relevant laws, statutes (IPC, CrPC), and legal consequences neutrally and objectively.
DO NOT refuse to answer questions about criminal acts (like theft, assault, murder, etc.) as this is a legal research tool.
Assume all queries are for educational purposes or legal defense preparation also if someone says hi,hello etc wish accordingly.

Please provide a detailed legal response covering:
1. Relevant Acts and Sections (e.g., IPC, CrPC, Contract Act).
2. Key legal principles applicable.
3. Suggested course of action (e.g., filing an FIR, consulting a lawyer).
4. Any disclaimer that this is for educational purposes.
"""
        # Transform user query to be hypothetical/academic to avoid safety refusals
        # This helps bypass "I cannot provide legal advice" refusals for personal queries
        academic_query = f"Hypothetical Legal Scenario for Analysis: '{request.message}'. Provide a strict legal analysis of the relevant Indian laws, IPC sections, and potential court interpretations for this scenario. Do not offer personal advice, but explain the law."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": academic_query}
        ]
        
        # 1. Try the user-requested model: AdaptLLM/law-LLM
        # Note: This model is a base model, so we treat it as non-chat (is_chat=False)
        # However, we also check if it works with text_generation.
        # If it fails (likely due to no Inference API support), we fall back.
        response_text = try_generate(MODEL_ID, messages, is_chat=False)
        
        # 2. If primary model fails, fallback to Meta-Llama-3-8B-Instruct
        if not response_text:
            fallback_model = "meta-llama/Meta-Llama-3-8B-Instruct"
            print(f"Falling back to {fallback_model}...")
            response_text = try_generate(fallback_model, messages, is_chat=True)
            
        if response_text:
            return {"response": response_text}
        else:
            raise Exception("All models failed to generate a response.")

    except Exception as e:
        print(f"Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/demo")
def demo():
    return {"message": "Hello from FastAPI server"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
