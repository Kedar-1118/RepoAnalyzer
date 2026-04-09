/**
 * RAG Repository Analyzer — Frontend Logic
 * Handles API calls, UI state management, and dynamic result rendering.
 */

// === State ===
let isAnalyzing = false;

// === Entry Point ===
async function runAnalysis() {
    if (isAnalyzing) return;

    const repoUrl = document.getElementById('repoUrl').value.trim();
    if (!repoUrl) {
        shakeInput('repoUrl');
        return;
    }

    // Validate URL format
    if (!/github\.com\/[^/]+\/[^/]+/.test(repoUrl)) {
        showError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
        return;
    }

    const devSkills = document.getElementById('devSkills').value.trim();

    isAnalyzing = true;
    showLoading();
    hideError();
    hideResults();
    disableButton();

    // Animate pipeline steps
    const stepTimer = animatePipelineSteps();

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repo_url: repoUrl,
                developer_skills: devSkills,
            }),
        });

        clearInterval(stepTimer);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data = await response.json();
        renderResults(data);
        hideLoading();
        showResults();

    } catch (err) {
        clearInterval(stepTimer);
        hideLoading();
        showError(err.message);
    } finally {
        isAnalyzing = false;
        enableButton();
    }
}

// === UI State Management ===

function showLoading() {
    document.getElementById('loadingSection').style.display = 'block';
    // Reset all steps
    for (let i = 1; i <= 6; i++) {
        const el = document.getElementById(`step${i}`);
        el.classList.remove('active', 'done');
    }
}

function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function showResults() {
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorSection').style.display = 'block';
}

function hideError() {
    document.getElementById('errorSection').style.display = 'none';
}

function disableButton() {
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loader').style.display = 'inline-flex';
}

function enableButton() {
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loader').style.display = 'none';
}

function resetUI() {
    hideError();
    hideResults();
    hideLoading();
    enableButton();
    document.getElementById('repoUrl').focus();
}

function shakeInput(id) {
    const el = document.getElementById(id);
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
}

// === Pipeline Step Animation ===
function animatePipelineSteps() {
    let currentStep = 1;
    const interval = setInterval(() => {
        if (currentStep > 6) {
            clearInterval(interval);
            return;
        }
        // Mark previous step as done
        if (currentStep > 1) {
            document.getElementById(`step${currentStep - 1}`).classList.remove('active');
            document.getElementById(`step${currentStep - 1}`).classList.add('done');
        }
        // Mark current step as active
        document.getElementById(`step${currentStep}`).classList.add('active');
        currentStep++;
    }, 8000); // ~8 seconds per step
    // Immediately activate step 1
    document.getElementById('step1').classList.add('active');
    return interval;
}

// === Render Results ===
function renderResults(data) {
    // Repo header
    document.getElementById('repoName').textContent = data.metadata?.repo_name || 'Repository';
    document.getElementById('repoSummary').textContent = data.repository_summary || '';

    // Badges
    const badges = document.getElementById('repoBadges');
    badges.innerHTML = '';
    const badgeData = [
        { icon: '⭐', label: `${data.metadata?.stars ?? 0} stars` },
        { icon: '🍴', label: `${data.metadata?.forks ?? 0} forks` },
        { icon: '🐛', label: `${data.metadata?.open_issues ?? 0} issues` },
        { icon: '📝', label: data.metadata?.license || 'No license' },
        { icon: '💻', label: data.metadata?.primary_language || 'Unknown' },
    ];
    badgeData.forEach(b => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.innerHTML = `<span class="badge-icon">${b.icon}</span> ${b.label}`;
        badges.appendChild(span);
    });

    // Main score ring
    const mainScore = Math.round(data.repository_score || 0);
    animateScoreRing('mainScoreCircle', 'mainScoreValue', mainScore);

    // Score cards
    const codeQuality = Math.round(data.code_quality_score || 0);
    document.getElementById('codeQualityScore').textContent = codeQuality;
    setTimeout(() => {
        document.getElementById('codeQualityBar').style.width = `${codeQuality}%`;
    }, 200);

    const complexityEl = document.getElementById('complexityLevel');
    complexityEl.textContent = data.complexity_level || '—';
    complexityEl.style.borderColor = getComplexityColor(data.complexity_level);
    complexityEl.style.color = getComplexityColor(data.complexity_level);

    const skillMatch = Math.round(data.skill_match_score || 0);
    document.getElementById('skillMatchScore').textContent = skillMatch > 0 ? skillMatch : '—';
    setTimeout(() => {
        document.getElementById('skillMatchBar').style.width = `${skillMatch}%`;
    }, 300);

    const devScore = Math.round(data.developer_technical_score || 0);
    document.getElementById('devScore').textContent = devScore > 0 ? devScore : '—';
    setTimeout(() => {
        document.getElementById('devScoreBar').style.width = `${devScore}%`;
    }, 400);

    // Technology stack
    const techContainer = document.getElementById('techStack');
    techContainer.innerHTML = '';
    (data.technology_stack || []).forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
    });

    // Architecture
    document.getElementById('archPattern').textContent = data.architecture_pattern || 'Unknown';
    document.getElementById('archExplanation').textContent = data.architecture_explanation || '';

    // Required skills
    const skillsContainer = document.getElementById('requiredSkills');
    skillsContainer.innerHTML = '';
    (data.required_skills || []).forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });

    // Contribution opportunities
    const contribList = document.getElementById('contributions');
    contribList.innerHTML = '';
    (data.contribution_opportunities || []).forEach(opp => {
        const li = document.createElement('li');
        li.textContent = opp;
        contribList.appendChild(li);
    });

    // Code quality explanation
    document.getElementById('codeQualityExplanation').textContent =
        data.code_quality_explanation || '';

    // Scoring breakdown
    const breakdownContainer = document.getElementById('scoringBreakdown');
    breakdownContainer.innerHTML = '';
    const breakdown = data.repository_scoring_breakdown || {};
    Object.entries(breakdown).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <span class="breakdown-item-label">${key.replace(/_/g, ' ')}</span>
            <span class="breakdown-item-value">${Math.round(value)}</span>
        `;
        breakdownContainer.appendChild(item);
    });

    // Developer evaluation breakdown (if present)
    const devEval = data.developer_evaluation || {};
    if (Object.keys(devEval).length > 0) {
        Object.entries(devEval).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <span class="breakdown-item-label">Dev: ${key.replace(/_/g, ' ')}</span>
                <span class="breakdown-item-value">${Math.round(value)}</span>
            `;
            breakdownContainer.appendChild(item);
        });
    }

    // Full analysis
    document.getElementById('fullAnalysis').textContent = data.analysis_explanation || '';

    // Metadata
    const metaGrid = document.getElementById('metadataGrid');
    metaGrid.innerHTML = '';
    const metaItems = [
        { label: 'Owner', value: data.metadata?.repo_owner },
        { label: 'Created', value: formatDate(data.metadata?.created_at) },
        { label: 'Last Updated', value: formatDate(data.metadata?.updated_at) },
        { label: 'Size', value: `${data.metadata?.size_kb ?? 0} KB` },
        { label: 'Contributors', value: data.metadata?.contributors_count },
        { label: 'Default Branch', value: data.metadata?.default_branch },
    ];
    metaItems.forEach(m => {
        const item = document.createElement('div');
        item.className = 'meta-item';
        item.innerHTML = `
            <span class="meta-label">${m.label}</span>
            <span class="meta-value">${m.value || '—'}</span>
        `;
        metaGrid.appendChild(item);
    });

    // Processing time
    document.getElementById('processingTime').textContent =
        `Analysis completed in ${data.processing_time_seconds || 0}s`;
}

// === Helpers ===

function animateScoreRing(circleId, valueId, score) {
    const circle = document.getElementById(circleId);
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference * (1 - score / 100);

    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 300);

    // Animate number
    const valueEl = document.getElementById(valueId);
    let current = 0;
    const duration = 1500;
    const step = score / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        valueEl.textContent = Math.round(current);
    }, 16);
}

function getComplexityColor(level) {
    const colors = {
        'Beginner': '#10b981',
        'Intermediate': '#f59e0b',
        'Advanced': '#f43f5e',
    };
    return colors[level] || '#6366f1';
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

// === Keyboard shortcut ===
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('repoUrl').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runAnalysis();
    });
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        50% { transform: translateX(8px); }
        75% { transform: translateX(-4px); }
    }
`;
document.head.appendChild(style);
