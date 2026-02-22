from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import pathlib
import traceback
from typing import Optional, Annotated, List
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

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

# --- LangChain Setup ---

# 1. Define Models
# Primary Model (Base Model) - Treated as text generation
llm_primary = HuggingFaceEndpoint(
    repo_id=MODEL_ID,
    task="text-generation",
    max_new_tokens=500,
    temperature=0.7,
    repetition_penalty=1.15,
    huggingfacehub_api_token=HF_TOKEN
)

# Fallback Model (Chat Model)
llm_fallback = ChatHuggingFace(
    llm=HuggingFaceEndpoint(
        repo_id="meta-llama/Meta-Llama-3-8B-Instruct",
        task="text-generation",
        max_new_tokens=1000,
        temperature=0.7,
        huggingfacehub_api_token=HF_TOKEN
    )
)

# 2. Define Prompts
SYSTEM_PROMPT = """You are an expert legal assistant specialized in Indian Law and International Law.

Provide accurate and educational legal information with proper citations to relevant Indian statutes.

IMPORTANT INSTRUCTIONS:
- Use the Bharatiya Nyaya Sanhita, 2023 (BNS) instead of the Indian Penal Code, 1860 (IPC).
- Do NOT reference IPC sections unless explicitly asked.
- Cite laws in this format:
  Example: Section 103, Bharatiya Nyaya Sanhita, 2023.
- Where applicable, also reference:
    - Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)
    - Bharatiya Sakshya Adhiniyam, 2023 (BSA)
    - Relevant Special Acts (e.g., IT Act, POCSO Act, etc.)

Explain legal principles clearly in simple language.
Mention punishments, legal ingredients, and exceptions where applicable.
Clarify whether the offence is cognizable/non-cognizable and bailable/non-bailable when relevant.
Always recommend consulting a qualified advocate for specific legal cases.
"""

# Template for Chat Models
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("user", "Hypothetical Legal Scenario for Analysis: '{input}'. Provide a strict legal analysis of the relevant Indian laws, BNS sections, and potential court interpretations for this scenario. offer personal advice, but explain the law.")
])

# Template for Base Models (Manual formatting)
def format_for_base_model(input_dict):
    user_input = input_dict["input"]
    academic_query = f"Hypothetical Legal Scenario for Analysis: '{user_input}'. Provide a strict legal analysis of the relevant Indian laws, BNS sections, and potential court interpretations for this scenario. offer personal advice, but explain the law."
    return f"### System:\n{SYSTEM_PROMPT}\n\n### User:\n{academic_query}\n\n### Assistant:\n"

# 3. Define Chains with Fallback
# Chain for Base Model
chain_primary = (
    format_for_base_model 
    | llm_primary
)

# Chain for Chat Model
chain_fallback = (
    chat_prompt 
    | llm_fallback
)

# Combined Chain with Fallback
final_chain = chain_primary.with_fallbacks([chain_fallback])

# --- LangGraph Setup ---

class State(TypedDict):
    # Messages have the type "list" to support appending new messages
    # The `add_messages` function handles the merge logic
    messages: Annotated[List, add_messages]
    # We store the latest user input separately for the prompt template
    latest_input: str

def call_model(state: State):
    latest_input = state["latest_input"]
    response = final_chain.invoke({"input": latest_input})
    
    # Handle response type (string vs AIMessage)
    if hasattr(response, "content"):
        content = response.content
    else:
        content = str(response)
        
    return {"messages": [content]}

# Define the graph
workflow = StateGraph(State)
workflow.add_node("legal_advisor", call_model)
workflow.add_edge(START, "legal_advisor")
workflow.add_edge("legal_advisor", END)

# Add memory for statefulness
memory = MemorySaver()
app_graph = workflow.compile(checkpointer=memory)

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None

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
async def get_legal_advice(request: ChatRequest):
    if not HF_TOKEN:
        raise HTTPException(
            status_code=500, 
            detail="Configuration Error: HF_TOKEN is missing in .env file. Please add your Hugging Face API token to the .env file in the project root."
        )

    try:
        print(f"Received request: {request.message}")
        
        # Determine thread_id (use provided one or default to a stateless one if needed, 
        # but to support statefulness we really need a persistent ID. 
        # If user doesn't provide one, we generate a random one for this request only)
        thread_id = request.thread_id or "default_thread"
        
        config = {"configurable": {"thread_id": thread_id}}
        
        # Invoke the graph
        # We pass the input message. The graph state handles the rest.
        input_state = {
            "messages": [("user", request.message)],
            "latest_input": request.message
        }
        
        # Stream the output or invoke directly. Since we want a single response:
        try:
            result = await app_graph.ainvoke(input_state, config=config)
        except (RuntimeError, StopIteration) as e:
            # Catch specific errors related to Hugging Face auth or empty responses
            print(f"Model Invocation Error: {e}")
            traceback.print_exc()
            if "StopIteration" in str(e) or isinstance(e, StopIteration):
                raise HTTPException(status_code=500, detail="Model returned no response. This is often caused by an invalid or missing HF_TOKEN, or the model is gated/inaccessible.")
            raise HTTPException(status_code=500, detail=f"Model Invocation Failed: {str(e)}")

        # Extract the last message content
        if "messages" not in result or not result["messages"]:
             raise HTTPException(status_code=500, detail="Model returned an empty message list.")

        last_message = result["messages"][-1]
        response_text = last_message.content if hasattr(last_message, "content") else str(last_message)
        
        return {"response": response_text}

    except HTTPException:
        raise
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
