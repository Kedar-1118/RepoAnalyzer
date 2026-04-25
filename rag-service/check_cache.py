import sqlite3, json

conn = sqlite3.connect('analysis_cache.db')
row = conn.execute(
    'SELECT analysis_json FROM analysis_cache WHERE repo_key = ?',
    ('processing/p5.js',)
).fetchone()

if row:
    data = json.loads(row[0])
    print(f"summary: {data.get('repository_summary', 'MISSING')[:100]}")
    print(f"code_quality_score: {data.get('code_quality_score')}")
    print(f"technology_stack: {data.get('technology_stack')}")
    print(f"architecture_pattern: {data.get('architecture_pattern')}")
else:
    print("No cached entry found")

conn.close()
