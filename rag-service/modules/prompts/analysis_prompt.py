"""Analysis prompt template.

Contains the structured prompt sent to the LLM for repository analysis,
formatted with repository metadata and retrieved code context.
"""


def build_analysis_prompt(
    metadata: dict,
    retrieved_context: str,
    developer_skills: str = "",
) -> str:
    """Build the complete analysis prompt for the LLM.

    Args:
        metadata: Repository metadata dict
        retrieved_context: Retrieved code chunks as a formatted string
        developer_skills: Optional comma-separated developer skills

    Returns:
        Formatted prompt string
    """
    developer_section = ""
    if developer_skills and developer_skills.strip():
        developer_section = f"""
Developer Skills (provided for matching):
{developer_skills}
"""

    skill_match_instruction = ""
    if developer_skills and developer_skills.strip():
        skill_match_instruction = """
8. **Developer Skill Matching**
   Compare the developer skills provided above with the skills required for this repository.
   Calculate: Skill Match Score = (matched_skills / total_repository_skills) × 100
   Explain which skills match and which are missing.

9. **Recruiter Evaluation**
   Evaluate the developer based on this repository using the scoring:
   - Code Quality Score (out of 100)
   - Architecture Understanding (out of 100)
   - Skill Diversity (out of 100)
   - Documentation Quality (out of 100)
   - Project Complexity (out of 100)

   Compute Developer Technical Score:
   = 0.30 × code_quality + 0.25 × architecture + 0.20 × skill_diversity + 0.15 × documentation + 0.10 × project_complexity
   Return score out of 100.
"""
    else:
        skill_match_instruction = """
8. **Developer Skill Matching**: Set skill_match_score to 0 (no developer skills provided).

9. **Recruiter Evaluation**: Set developer_technical_score to 0 (no developer context provided).
"""

    prompt = f"""You are an expert software architecture analyst and code reviewer.
Analyze the following GitHub repository using the provided metadata and code context.

=== REPOSITORY METADATA ===
Repository Name: {metadata.get('repo_name', 'Unknown')}
Repository URL: {metadata.get('repo_url', 'Unknown')}
Owner: {metadata.get('repo_owner', 'Unknown')}
Description: {metadata.get('description', 'No description')}
Primary Language: {metadata.get('primary_language', 'Unknown')}
All Languages: {', '.join(metadata.get('languages', []))}
Stars: {metadata.get('stars', 0)}
Forks: {metadata.get('forks', 0)}
Open Issues: {metadata.get('open_issues', 0)}
Watchers: {metadata.get('watchers', 0)}
License: {metadata.get('license', 'None')}
Created: {metadata.get('created_at', 'Unknown')}
Last Updated: {metadata.get('updated_at', 'Unknown')}
Last Pushed: {metadata.get('pushed_at', 'Unknown')}
Size (KB): {metadata.get('size_kb', 0)}
Contributors: {metadata.get('contributors_count', 0)}
Topics: {', '.join(metadata.get('topics', []))}
{developer_section}

=== RETRIEVED CODE CONTEXT ===
{retrieved_context}

=== ANALYSIS TASKS ===

Perform ALL of the following analyses:

1. **Repository Summary**
   Explain what the repository does and its primary purpose in 2-3 sentences.

2. **Technology Stack**
   List ALL technologies used: programming languages, frameworks, libraries, databases, APIs, infrastructure tools.

3. **Architecture Analysis**
   Identify the architectural pattern (MVC, Microservices, Layered, Monolithic, Event-driven, Serverless, etc.).
   Explain the repository structure and how components are organized.

4. **Code Quality Analysis**
   Evaluate: code readability, modularity, maintainability, documentation quality, naming conventions, test coverage.
   Give a score out of 100.

5. **Complexity Estimation**
   Based on codebase size, modules, dependencies, and architectural complexity,
   classify as: "Beginner", "Intermediate", or "Advanced".

6. **Developer Skill Extraction**
   List specific skills needed to work on this repository (e.g., "Python", "React", "Docker", "PostgreSQL").

7. **Contribution Opportunities**
   Suggest areas where contributors can help: bug fixes, documentation, performance, features, testing.

{skill_match_instruction}

10. **Repository Score**
    Compute repository quality score:
    = 0.30 × code_quality + 0.25 × architecture + 0.20 × documentation + 0.15 × activity + 0.10 × popularity
    Return score out of 100.

=== OUTPUT FORMAT ===

Return ONLY valid JSON with this exact structure (no markdown, no explanations outside JSON):

{{
    "repository_summary": "<string: 2-3 sentence summary>",
    "technology_stack": ["<string>", ...],
    "architecture_pattern": "<string: architectural pattern name>",
    "architecture_explanation": "<string: brief architecture explanation>",
    "code_quality_score": <number: 0-100>,
    "code_quality_explanation": "<string: brief quality justification>",
    "complexity_level": "<string: Beginner|Intermediate|Advanced>",
    "required_skills": ["<string>", ...],
    "contribution_opportunities": ["<string>", ...],
    "skill_match_score": <number: 0-100>,
    "skill_match_explanation": "<string: match explanation>",
    "developer_technical_score": <number: 0-100>,
    "developer_evaluation": {{
        "code_quality": <number: 0-100>,
        "architecture_understanding": <number: 0-100>,
        "skill_diversity": <number: 0-100>,
        "documentation_quality": <number: 0-100>,
        "project_complexity": <number: 0-100>
    }},
    "repository_score": <number: 0-100>,
    "repository_scoring_breakdown": {{
        "code_quality": <number: 0-100>,
        "architecture": <number: 0-100>,
        "documentation": <number: 0-100>,
        "activity": <number: 0-100>,
        "popularity": <number: 0-100>
    }},
    "analysis_explanation": "<string: comprehensive analysis narrative>"
}}

IMPORTANT: Return ONLY the JSON object. No markdown code fences. No additional text.
"""
    return prompt
