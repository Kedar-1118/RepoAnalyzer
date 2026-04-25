"""Quick test script to verify Ollama is responding correctly."""

import json
from config import settings
from modules.llm_analyzer import get_llm

def test_basic():
    """Test basic Ollama connectivity with a simple prompt."""
    print(f"Provider : {settings.LLM_PROVIDER}")
    print(f"Model    : {settings.OLLAMA_MODEL}")
    print(f"Base URL : {settings.OLLAMA_BASE_URL}")
    print("-" * 60)

    llm = get_llm()
    print(f"LLM type : {type(llm).__name__}")
    print("-" * 60)

    # --- Test 1: Simple text response ---
    print("\n[Test 1] Simple text prompt...")
    response = llm.invoke("Say hello in one sentence.")
    print(f"Response type: {type(response)}")
    print(f"Content: {response.content}")

    # --- Test 2: JSON response (simulates analysis) ---
    print("\n" + "-" * 60)
    print("[Test 2] JSON output prompt...")
    json_prompt = """You are a JSON-only assistant. Return ONLY valid JSON, no markdown fences, no extra text.

Analyze this repository metadata and return a JSON object:

Repository: "example/todo-app"
Language: JavaScript
Stars: 120
Description: "A simple todo application built with React"

Return JSON with these keys:
- repository_summary (string)
- technology_stack (array of strings)
- code_quality_score (integer 0-100)
- complexity_level (string: "Beginner", "Intermediate", or "Advanced")

Return ONLY the JSON object, nothing else."""

    response2 = llm.invoke(json_prompt)
    raw_text = response2.content if hasattr(response2, "content") else str(response2)
    
    print(f"Raw response ({len(raw_text)} chars):")
    print(raw_text[:2000])
    
    # Try to parse it
    print("\n" + "-" * 60)
    print("[Parsing check]")
    try:
        # Strip markdown fences if present
        clean = raw_text.strip()
        if clean.startswith("```"):
            import re
            clean = re.sub(r"^```(?:json)?\s*\n?", "", clean)
            clean = re.sub(r"\n?```\s*$", "", clean)
        
        start = clean.find("{")
        end = clean.rfind("}") + 1
        if start != -1 and end > start:
            parsed = json.loads(clean[start:end])
            print("✅ JSON parsed successfully!")
            print(json.dumps(parsed, indent=2))
        else:
            print("❌ No JSON object found in response")
    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        print(f"Attempted to parse: {clean[start:end][:500]}")


if __name__ == "__main__":
    test_basic()
