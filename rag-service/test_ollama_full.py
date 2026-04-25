"""Test the full analysis prompt with Ollama to debug response quality."""

import json
import time
from config import settings
from modules.llm_analyzer import get_llm
from modules.prompts.analysis_prompt import build_analysis_prompt

# Fake metadata for testing
fake_metadata = {
    "repo_name": "RepoAnalyzer",
    "repo_url": "https://github.com/Kedar-1118/RepoAnalyzer",
    "repo_owner": "Kedar-1118",
    "description": "RepoAnalyzer is a tool for analyzing open-source repositories",
    "primary_language": "Python",
    "languages": ["Python", "HTML", "CSS"],
    "stars": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "license": "MIT",
    "created_at": "2026-01-01",
    "updated_at": "2026-01-01",
    "pushed_at": "2026-01-01",
    "size_kb": 500,
    "contributors_count": 2,
    "topics": ["python", "web", "ai"],
}

fake_context = """
// File: src/core/main.js
class p5 {
  constructor(sketch, node) {
    this._setupDone = false;
    this.canvas = null;
  }
  createCanvas(w, h, renderer) {
    // Create the drawing canvas
  }
}
"""

print(f"Provider: {settings.LLM_PROVIDER}")
print(f"Model: {settings.OLLAMA_MODEL}")
print("=" * 60)

prompt = build_analysis_prompt(fake_metadata, fake_context, "")
print(f"Prompt length: {len(prompt)} chars")
print("=" * 60)

print("Sending to LLM... (this may take a while with local Ollama)")
start = time.time()

llm = get_llm()
response = llm.invoke(prompt)

elapsed = time.time() - start
content = response.content if hasattr(response, "content") else str(response)
print(f"\nResponse received in {elapsed:.1f}s ({len(content)} chars)")
print("=" * 60)
print("RAW RESPONSE:")
print(content)
print("=" * 60)

# Try to parse
import re
clean = content.strip()
if clean.startswith("```"):
    clean = re.sub(r"^```(?:json)?\s*\n?", "", clean)
    clean = re.sub(r"\n?```\s*$", "", clean)

start_idx = clean.find("{")
end_idx = clean.rfind("}") + 1
if start_idx != -1 and end_idx > start_idx:
    try:
        parsed = json.loads(clean[start_idx:end_idx])
        print("JSON PARSED OK! Keys:", list(parsed.keys()))
        print(json.dumps(parsed, indent=2)[:2000])
    except json.JSONDecodeError as e:
        print(f"JSON PARSE FAILED: {e}")
        print(f"JSON substring: {clean[start_idx:start_idx+500]}...")
else:
    print("NO JSON OBJECT FOUND in response")
