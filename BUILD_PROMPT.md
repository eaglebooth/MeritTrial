# MeritTrial — BUILD PROMPT
# Copy toàn bộ nội dung này và paste vào Claude Code để build toàn bộ dự án
# Output: Smart contract GenLayer Python + Landing page Next.js/Tailwind

---

# ═══════════════════════════════════════════════════════════════════
# PHẦN 1: GENLAYER SMART CONTRACT
# ═══════════════════════════════════════════════════════════════════

Build a production-ready GenLayer Intelligent Contract for "MeritTrial" — a bias-free AI-powered candidate evaluation platform. AI reads candidate evidence (GitHub, portfolio, resume URLs), analyzes skills against job requirements, and produces a verified evaluation record on-chain.

## REFERENCE CONTRACT
Study this existing GenLayer contract for all patterns and conventions:
- File: C:\Users\admin\OneDrive\Documents\Genlayer\GenGrant\GenGrant.py
- Version: v0.2.16
- Dependency: py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6

## FILE HEADER (Required)
```
# v0.1.0
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import typing
import json
```

## CONTRACT OVERVIEW
MeritTrial is an AI-powered candidate evaluation platform. Employers post job openings with requirements. Candidates submit evidence URLs (GitHub, portfolio, resume, code challenges). AI validators fetch all evidence, analyze skills match against job requirements, produce a bias-free evaluation verdict, and store it on-chain. The evaluation is challengeable within a window for quality assurance.

## STORAGE DECLARATIONS (in class body)

```python
class MeritTrial(gl.Contract):
    # ── Job Posting Storage ───────────────────────────────────────
    job_titles: TreeMap[u256, str]
    job_descriptions: TreeMap[u256, str]
    job_requirements: TreeMap[u256, str]        # JSON: required skills list
    job_company: TreeMap[u256, str]
    job_status: TreeMap[u256, str]              # "OPEN" / "CLOSED"
    job_evaluation_fee: TreeMap[u256, u256]     # Fee to evaluate a candidate
    job_challenge_window: TreeMap[u256, u256]   # Blocks to wait before finalizing
    job_count: u256

    # ── Candidate Application Storage ────────────────────────────
    app_job_ids: TreeMap[u256, u256]
    app_candidate_id: TreeMap[u256, str]        # Anonymized candidate identifier
    app_resume_url: TreeMap[u256, str]
    app_github_url: TreeMap[u256, str]
    app_portfolio_url: TreeMap[u256, str]
    app_code_challenge_url: TreeMap[u256, str]
    app_cover_letter_url: TreeMap[u256, str]
    app_status: TreeMap[u256, str]              # "PENDING" / "EVALUATED" / "CHALLENGED" / "FINALIZED"
    app_evaluation_json: TreeMap[u256, str]     # Full AI verdict JSON
    app_tech_rating: TreeMap[u256, u256]
    app_skills_match: TreeMap[u256, str]        # JSON: matched/missing skills
    app_recommendation: TreeMap[u256, str]      # STRONG_HIRE / HIRE / REVIEW / NO_HIRE
    app_confidence: TreeMap[u256, u256]
    app_created_at: TreeMap[u256, u256]
    app_evaluated_at: TreeMap[u256, u256]
    app_challenge_deadline: TreeMap[u256, u256]
    app_count: u256

    # ── Challenge Storage ────────────────────────────────────────
    challenge_app_ids: DynArray[u256]
    challenge_reasons: DynArray[str]
    challenge_panel_verdicts: DynArray[str]     # JSON: panel of 3 AI verdicts
    challenge_outcome: DynArray[str]            # "UPHELD" / "OVERTURNED"
    challenge_timestamps: DynArray[u256]
    challenge_count: u256

    # ── Treasury / Platform Revenue ──────────────────────────────
    treasury_recipients: DynArray[str]
    treasury_amounts: DynArray[u256]
    treasury_types: DynArray[str]               # "EVALUATION_FEE" / "CHALLENGE_FEE"
    treasury_timestamps: DynArray[u256]
    treasury_count: u256
```

## CONSTRUCTOR

```python
def __init__(self):
    self.job_count = u256(0)
    self.app_count = u256(0)
    self.challenge_count = u256(0)
    self.treasury_count = u256(0)
```

## REQUIRED FUNCTIONS

### 1. Job Management

```python
@gl.public.write
def create_job(
    self,
    title: str,
    description: str,
    requirements_json: str,      # JSON string: {"skills": [...], "level": "...", "type": "..."}
    company: str,
    evaluation_fee: u256,
    challenge_window_blocks: u256
) -> typing.Any
```
Creates a new job posting. Returns job_id.

```python
@gl.public.view
def get_job(self, job_id: u256) -> str
```
Returns JSON string with all job details.

```python
@gl.public.view
def get_job_count(self) -> u256
```

```python
@gl.public.view
def get_job_status(self, job_id: u256) -> str
```

### 2. Candidate Application

```python
@gl.public.write
def submit_application(
    self,
    job_id: u256,
    candidate_id: str,           # Anonymized identifier (no real name, no gender, no age)
    resume_url: str,
    github_url: str,
    portfolio_url: str,
    code_challenge_url: str,
    cover_letter_url: str
) -> typing.Any
```
Creates a candidate application. Returns application_id.

**Validation rules:**
- job_id must be valid (< job_count)
- job_status must be "OPEN"
- candidate_id must be non-empty
- At least one evidence URL must be provided

```python
@gl.public.view
def get_application(self, app_id: u256) -> str
```
Returns JSON string with all application details.

```python
@gl.public.view
def get_application_count(self) -> u256
```

### 3. AI Evaluation (THE CORE FUNCTION)

```python
@gl.public.write
def evaluate_application(self, application_id: u256) -> str
```

This is the main AI evaluation function. Must follow the strict_eq pattern:

**Step-by-step logic:**
1. Validate: application_id in range, status is "PENDING"
2. Read all inputs deterministically:
   - job_requirements = self.job_requirements[job_id]
   - resume_url, github_url, portfolio_url, code_challenge_url
   - candidate_id (anonymized)
3. Define local function `run_evaluation() -> str`:
   a. Fetch each evidence URL using `gl.nondet.web.get(url)`
   b. Truncate each to 4000 chars
   c. Build the LLM prompt with ALL evidence inline
   d. Call `gl.nondet.exec_prompt(prompt)`
   e. Return the raw LLM response string
4. Call `gl.eq_principle.strict_eq(run_evaluation)` — consensus step
5. Parse JSON from the consensus result
6. Write all verdict fields to storage
7. Update application status to "EVALUATED"
8. Return the evaluation JSON

**The LLM Prompt Template (CRITICAL — must be exactly right):**

The prompt sent to exec_prompt should instruct the AI to act as a technical talent evaluator with strict bias-free rules:

```
You are a technical talent evaluator AI for a decentralized hiring platform. Your ONLY task: assess whether this candidate's skills match the job requirements.

BIAS-FREE EVALUATION RULES (MUST FOLLOW):
- IGNORE completely: name, gender, age, university pedigree, location, nationality, ethnicity, accent, appearance
- FOCUS ONLY ON: proof-of-work, code quality, problem-solving skills, communication ability, experience depth
- If evidence contains demographic info, explicitly disregard it in your analysis

JOB REQUIREMENTS:
{job_requirements}

CANDIDATE EVIDENCE:

--- RESUME ---
URL: {resume_url}
{resume_content}

--- GITHUB PROFILE ---
URL: {github_url}
{github_content}

--- PORTFOLIO ---
URL: {portfolio_url}
{portfolio_content}

--- CODE CHALLENGE ---
URL: {code_challenge_url}
{code_challenge_content}

--- COVER LETTER ---
URL: {cover_letter_url}
{cover_letter_content}

Evaluate based ONLY on the evidence above. Score each criterion 0-100:

1. technical_rating: Overall technical capability (0-100)
2. skills_match: {{"required": [...], "matched": [...], "missing": [...], "match_percentage": N}}
3. code_quality: Assessment of code quality from GitHub/challenge (POOR / FAIR / GOOD / EXCELLENT)
4. experience_depth: How deep is their demonstrated experience (0-100)
5. communication: Quality of documentation, READMEs, explanations (0-100)
6. problem_solving: Evidence of algorithmic thinking, architecture decisions (0-100)
7. red_flags: [list of concerns like "inconsistent timeline", "vague descriptions", "copy-paste code patterns"]
8. strengths: [list of standout qualities]
9. recommendation: STRONG_HIRE / HIRE / REVIEW / NO_HIRE
10. confidence: Your confidence in this evaluation (1-10)
11. evidence_summary: What specific evidence supports this rating?

Respond with ONLY this JSON, no other text or explanation:
{{{{"technical_rating":N,"skills_match":{{...}},"code_quality":"...","experience_depth":N,"communication":N,"problem_solving":N,"red_flags":[...],"strengths":[...],"recommendation":"...","confidence":N,"evidence_summary":"..."}}}}"
```

**After strict_eq returns the consensus result:**
```python
data = json.loads(evaluation_json)
self.app_tech_rating[application_id] = u256(int(data["technical_rating"]))
self.app_skills_match[application_id] = json.dumps(data["skills_match"])
self.app_recommendation[application_id] = str(data["recommendation"])
self.app_confidence[application_id] = u256(int(data["confidence"]))
self.app_evaluation_json[application_id] = evaluation_json  # Store full JSON
self.app_status[application_id] = "EVALUATED"
self.app_evaluated_at[application_id] = u256(0)  # block timestamp placeholder
# Calculate challenge deadline: current_block + challenge_window
self.app_challenge_deadline[application_id] = self.app_evaluated_at[application_id] + self.job_challenge_window[job_id]
```

### 4. Challenge Mechanism

```python
@gl.public.write
def challenge_evaluation(self, application_id: u256, reason: str) -> str
```

Allows employer or candidate to challenge an evaluation within the challenge window.

**Logic:**
1. Validate: application_id in range, status is "EVALUATED", within challenge window
2. Record challenge: append to challenge DynArrays
3. Trigger re-evaluation by a 3-panel AI jury:
   - Define a local function that runs 3 independent LLM evaluations with different prompt framing
   - Use `gl.eq_principle.strict_eq()` for each panel member
   - Collect 3 verdicts, take majority vote
4. If majority disagrees with original → update verdict, status = "FINALIZED" with new verdict
5. If majority upholds original → status = "FINALIZED", original stands
6. Record outcome in challenge_outcome DynArray

**Challenge re-evaluation prompt variation:**
The panel members should use slightly different framing to ensure independence:
- Panelist 1: "You are a senior technical interviewer reviewing an AI evaluation..."
- Panelist 2: "You are an independent HR expert auditing a candidate assessment..."
- Panelist 3: "You are a technical lead assessing candidate fit for a role..."

### 5. Finalize (Auto-executed after challenge window)

```python
@gl.public.write
def finalize_evaluation(self, application_id: u256) -> str
```

Called after challenge window expires with no challenge. Sets status to "FINALIZED".

### 6. Query Functions

```python
@gl.public.view
def get_evaluation(self, application_id: u256) -> str
```
Returns the full evaluation JSON string.

```python
@gl.public.view
def get_recommendation(self, application_id: u256) -> str
```

```python
@gl.public.view
def get_tech_rating(self, application_id: u256) -> u256
```

```python
@gl.public.view
def get_application_status(self, application_id: u256) -> str
```

```python
@gl.public.view
def get_challenge_count(self) -> u256
```

```python
@gl.public.view
def get_treasury_count(self) -> u256
```

```python
@gl.public.view
def get_treasury_record(self, index: u256) -> str
```

## IMPLEMENTATION RULES

1. **Follow GenGrant.py patterns exactly:**
   - Storage declarations in class body only
   - Constructor initializes all u256 counters to u256(0)
   - @gl.public.write for state-changing, @gl.public.view for reads
   - typing.Any return type for public write functions
   - Import order: `from genlayer import *`, `import typing`, `import json`

2. **Input validation (MANDATORY for every write function):**
   - Bounds check: reject IDs >= entity_count
   - Status check: reject already-finalized entities
   - Value-range check: reject invalid values
   - Return descriptive error strings (NOT exceptions)

3. **Non-determinism pattern (MANDATORY):**
   - All `gl.nondet.web.get()` and `gl.nondet.exec_prompt()` calls MUST be inside a local function
   - That local function is passed to `gl.eq_principle.strict_eq()`
   - Truncate ALL fetched content to 4000 chars BEFORE putting in prompt
   - Prompt must end with "Respond with ONLY this JSON, no other text or explanation"

4. **Bias prevention in the AI prompt:**
   - Explicitly instruct AI to ignore demographic information
   - Focus only on skills-based evidence
   - This is a KEY feature of MeritTrial — emphasize it in the prompt

5. **Error codes to return:**
   - "INVALID_ID" — ID out of range
   - "ALREADY_EVALUATED" — trying to evaluate twice
   - "JOB_CLOSED" — job no longer accepting applications
   - "OUTSIDE_CHALLENGE_WINDOW" — too late to challenge
   - "NO_EVIDENCE_URLS" — no URLs provided
   - "INVALID_STATUS" — wrong status for this operation

6. **The contract file name must match the class name:** MeritTrial.py → class MeritTrial(gl.Contract)

7. **No demo scripts, no `if __name__ == "__main__"`, no global function calls with side effects**

8. **Run `python -c "import ast; ast.parse(open('MeritTrial.py').read())"` — must exit with code 0**

9. **Run `genlayer lint MeritTrial.py` — zero errors, zero warnings**

## DEPLOYMENT STEPS
```bash
# 1. Verify contract
python -c "import ast; ast.parse(open('MeritTrial.py').read())"
genlayer lint MeritTrial.py

# 2. Deploy
genlayer deploy MeritTrial.py --name MeritTrial

# 3. Copy contract address from CLI output
# 4. Wire address into frontend .env.local:
# NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed address>
```

## OUTPUT
Create the complete `MeritTrial.py` contract file with:
- Full header (version + depends)
- All imports
- Complete class with all storage declarations
- Constructor
- All @gl.public.write functions with full implementation
- All @gl.public.view functions
- Detailed section comments
- Brief docstring at top explaining the contract


---

# ═══════════════════════════════════════════════════════════════════
# PHẦN 2: LANDING PAGE
# ═══════════════════════════════════════════════════════════════════

Build a production-ready landing page for "MeritTrial" — an AI-powered bias-free candidate evaluation platform built on GenLayer blockchain.

## DESIGN REFERENCE
Mô phỏng UI/UX theo https://cryonix.framer.website với các quy tắc sau:

### Màu sắc (Color Palette)
- Background chính: #0a0a0f (gần đen)
- Background section phụ: #0f0f18
- Primary accent: #3b82f6 (electric blue)
- Secondary accent: #8b5cf6 (purple)
- Gradient hero: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)
- Text chính: #ffffff
- Text phụ: #9ca3af (gray-400)
- Border: rgba(255, 255, 255, 0.08)
- Card background: rgba(255, 255, 255, 0.03)
- Card hover: rgba(255, 255, 255, 0.06)
- Success green: #10b981
- Warning amber: #f59e0b
- Reject red: #ef4444

### Typography
- Font chính: Inter (Google Fonts)
- Headline: font-weight 700, letter-spacing -0.02em
- Subheadline: font-weight 500
- Body: font-weight 400, line-height 1.6
- Mono (cho stats/code): 'JetBrains Mono' hoặc Inter

### Layout & Spacing
- Max content width: 1280px, centered
- Section padding: 120px top/bottom
- Grid gap: 24px
- Card border-radius: 16px
- Button border-radius: 12px
- Nav height: 72px

### Hiệu ứng (Effects)
- Glassmorphism nhẹ trên cards: backdrop-blur(12px) + background: rgba(255,255,255,0.03)
- Hover cards: translateY(-4px) + shadow-lg
- Gradient text cho headline chính
- Smooth scroll behavior
- Fade-in animation khi scroll (Intersection Observer)

---

## SECTIONS CẦN BUILD (theo đúng thứ tự)

### 1. Navigation Bar (Fixed, Sticky)
- Logo "MeritTrial" bên trái (gradient text, có thể kèm icon ⚖️)
- Nav links: How It Works, Features, For Employers, For Candidates, FAQ, Contact
- CTA button "Start Evaluating" bên phải (primary gradient)
- Mobile: hamburger menu
- Blur backdrop khi scroll

### 2. Hero Section (Full viewport height - 100vh)
**Background:**
- Deep dark (#0a0a0f)
- Subtle grid pattern overlay
- Floating glow orbs (blue/purple) với blur 100px
- Maybe subtle noise texture

**Content:**
- Badge "⚡ Powered by GenLayer Blockchain" nhỏ, outlined, phía trên
- Headline: "Hiring, Without the Bias." (line 1, gradient text)
- Headline: "AI-Verified Talent Evaluation." (line 2)
- Subheadline: "Smart contracts that read GitHub, portfolios, and resumes — then analyze skills with AI. No names. No genders. No universities. Just proof of work, evaluated fairly on-chain."
- Two CTA buttons: "For Employers" (primary gradient) + "For Candidates" (secondary outlined)
- Below buttons: Trust indicators: "50+ AI Validators | Bias-Free by Design | Immutable Results"
- Phía dưới hero: Mockup UI preview — hình ảnh/pseudo-UI của một candidate evaluation interface (card hiển thị evaluation result: "TECHNICAL RATING: 87/100", "RECOMMENDATION: STRONG_HIRE", skills matched/missing)

### 3. Stats Section (Horizontal bar, dark background)
- 4 cột:
  - "0%" — Bias Score (zero demographic bias)
  - "< 60s" — Evaluation Time
  - "100%" — Skills-Based Assessment
  - "100%" — On-Chain Verifiable

### 4. How It Works Section (3 Steps)
- Section label: "HOW IT WORKS" nhỏ, outlined badge
- Headline: "From Resume to Verdict in 3 Steps"
- 3 bước với số thứ tự lớn (01, 02, 03):
  1. **Post Job / Submit Application** — "Employers post job requirements. Candidates submit anonymized evidence: GitHub URLs, portfolio links, code challenges. No names, no photos, no demographic info."
  2. **AI Analysis** — "GenLayer validators fetch all evidence via web.get(). AI reads code, analyzes skills against requirements, applies technical assessment standards, and reaches consensus verdict — completely ignoring demographic signals."
  3. **Verified Result** — "Smart contract stores the evaluation on-chain. Immutable, auditable, challengeable. Employers see skills-based recommendation. Candidates get fair, unbiased feedback."
- Mỗi bước có icon, title, description, và optional technical note nhỏ (monospace font)
- Connector line giữa 3 bước

### 5. Features Section (Grid 2x3 hoặc 3x2)
- Section label: "FEATURES"
- Headline: "Built for Fair Hiring"
- 6 feature cards:
  1. **🎭 Anonymized Evaluation** — "AI only sees skills evidence — no names, genders, universities, or photos. Demographic info is explicitly excluded from the analysis."
  2. **🌐 Native Web Evidence Fetching** — "AI jurors read GitHub repos, portfolio sites, and resume URLs directly on-chain. No oracles, no off-chain data silos."
  3. **🧠 Deep Code Analysis** — "LLM reads actual code from GitHub — architecture, complexity, commit patterns, collaboration quality. Not just keyword matching."
  4. **⚡ Optimistic Democracy Consensus** — "Multiple AI validators must reach byte-identical verdict. Slashing prevents collusion. The network agrees on the outcome."
  5. **🔁 Challengeable Verdicts** — "7-day challenge window. Disputed evaluations trigger 3-panel AI re-evaluation. Quality assurance built into the protocol."
  6. **🔗 Blockchain-Verified Results** — "Every evaluation is stored on-chain with timestamp. Immutable audit trail. Employers prove they used fair evaluation. Candidates own their verified records."

- Mỗi card: icon emoji, title (font-weight 600), description, subtle gradient border on hover

### 6. Use Cases Section (Two columns: Employers vs Candidates)
- Section label: "USE CASES"
- Headline: "Fair Evaluation for Everyone"
- 2 cột lớn:

**Bên trái — For Employers:**
- **Tech Hiring** — "Evaluate GitHub repos, code challenges, and technical portfolios at scale. Find the best engineers without pedigree bias."
- **University Recruiting** — "Screen thousands of candidates from diverse backgrounds fairly. No more filtering by university name."
- **Remote/Global Hiring** — "Evaluate international candidates with the same rigor. No location bias, no network advantage."
- **Diversity & Inclusion** — "Prove your hiring process is fair. On-chain audit trail shows zero demographic correlation."

**Bên phải — For Candidates:**
- **Verified Skill Records** — "Your evaluations are stored on-chain. Build a verified portfolio of AI-assessed skills that you own."
- **Anonymous Applications** — "Apply without revealing name, gender, age, or university. Let your code speak."
- **Challenge Unfair Results** — "Disagree with the evaluation? Challenge it within 7 days. A panel of 3 AI experts re-evaluates."
- **Global Opportunity** — "Your skills are evaluated fairly regardless of where you're from. No passport premium."

### 7. Technical Architecture Section (Dark, code-like aesthetic)
- Section label: "UNDER THE HOOD"
- Headline: "Powered by GenLayer's Intelligent Contracts"
- 2 cột layout:
  - **Bên trái:** Mô tả text về MeritTrial architecture
    - "MeritTrial runs on GenLayer's GenVM — a Python-based execution environment where smart contracts can fetch the internet and run AI reasoning natively."
    - "When an evaluation is requested, AI validators independently: (1) fetch candidate evidence from GitHub, portfolio, and resume URLs, (2) analyze code quality, skills match, and experience depth, (3) produce a structured JSON verdict."
    - "The `gl.eq_principle.strict_eq()` consensus mechanism ensures all validators produce byte-identical outputs — no room for manipulation."
    - "Results are stored on-chain, immutable, and auditable by anyone."
  - **Bên phải:** Code snippet display (mockup) — hiển thị phần code:
    ```python
    @gl.public.write
    def evaluate_application(self, application_id: u256) -> str:
        # Fetch candidate evidence from URLs
        github = gl.nondet.web.get(github_url)
        portfolio = gl.nondet.web.get(portfolio_url)
        resume = gl.nondet.web.get(resume_url)

        # AI analysis — bias-free by design
        prompt = build_evaluation_prompt(
            job_requirements, github, portfolio, resume
        )
        verdict = gl.nondet.exec_prompt(prompt)

        # Consensus: all validators must agree
        result = gl.eq_principle.strict_eq(evaluate)
        return json.loads(result)
    ```
  - Styling: dark code block, syntax highlighting màu sắc, border-radius, subtle border
- Dưới code: 3 tech badges: "GenVM Runtime" | "Python Contracts" | "AI Validator Network"

### 8. Comparison Section (Table hoặc VS cards)
- Section label: "VS TRADITIONAL HIRING"
- Headline: "Why MeritTrial Changes Everything"
- Comparison table với 2 cột: "Traditional Hiring" vs "MeritTrial"
  - Evaluation Basis: Resume keywords + pedigree vs Actual code + skills proof
  - Bias: Name, university, gender, location vs Explicitly excluded from analysis
  - Speed: 23 hours per resume vs < 60 seconds
  - Scale: Manual review limits vs Unlimited parallel AI evaluation
  - Transparency: Opaque decisions vs Fully auditable on-chain
  - Appeal: HR manager discretion vs Multi-panel AI re-evaluation
  - Cost: $500-4,000 per hire (recruiter fee) vs 1-3% platform fee

### 9. Bias Prevention Section (Highlight section, different background)
- Section label: "OUR COMMITMENT"
- Headline: "Bias Isn't Just Unfair — It's Expensive"
- Subheadline: "McKinsey estimates hiring bias costs $386B/year in lost productivity. MeritTrial's AI is explicitly instructed to ignore demographic signals."
- 3 proof points:
  1. **Anonymized by Default** — "Candidate submissions strip all demographic info. The AI never sees names, genders, ages, or universities."
  2. **Prompt-Engineered Fairness** — "The evaluation prompt explicitly instructs the LLM: 'IGNORE name, gender, age, university pedigree, location, nationality. FOCUS ONLY ON: proof-of-work, code quality, problem-solving.'"
  3. **Auditable Fairness** — "Researchers can audit the AI's decisions on-chain. Prove correlation between evaluation scores and demographic factors is zero."
- Optional: small chart/visual showing "bias score: 0%" vs industry average

### 10. CTA Section (Hero-style, gradient background)
- Full-width gradient section (#3b82f6 → #8b5cf6)
- Headline lớn: "Ready to Hire Fairly?"
- Subtext: "Join the waitlist for early access to MeritTrial on GenLayer testnet."
- Input email + button "Join Waitlist" (dark button trên gradient background)
- Phía dưới: "No spam. Only product updates. Unsubscribe anytime."

### 11. FAQ Section (Accordion)
- Section label: "FAQ"
- Headline: "Common Questions"
- 5-6 questions dạng accordion:
  1. "How does MeritTrial prevent bias?" — Trả lời: AI prompt explicitly instructs ignoring demographic info. Only skills-based evidence is analyzed. The on-chain audit trail allows independent verification of zero demographic correlation.
  2. "Can AI really evaluate candidates fairly?" — Trả lời: GenLayer's Optimistic Democracy ensures multiple AI validators must agree on the verdict. The consensus mechanism + challenge window provides strong fairness guarantees.
  3. "What evidence can candidates submit?" — Trả lời: GitHub repos, portfolio websites, resume URLs, code challenge submissions, cover letters. All submitted as URLs — the AI fetches and reads them directly.
  4. "Is the evaluation legally binding?" — Trả lời: Results are stored on-chain as immutable records. Employers can use them as part of their hiring decision. The evaluation itself is a verified assessment, not an employment contract.
  5. "What if a candidate disagrees with the evaluation?" — Trả lời: 7-day challenge window. When challenged, a panel of 3 independent AI validators re-evaluates. If 2/3 disagree with the original, the verdict is overturned.
  6. "How much does it cost?" — Trả lời: 1-3% of the evaluation fee. Traditional recruiter fees are 15-20% of first-year salary. MeritTrial is dramatically cheaper and fairer.

### 12. Footer
- Logo "MeritTrial" (gradient) + tagline "AI-Verified. Bias-Free. On-Chain."
- 3 cột links:
  - Product: How It Works, Features, Use Cases, Pricing
  - Developers: Documentation, GenLayer Docs, GitHub, Testnet
  - Legal: Terms of Service, Privacy Policy, Arbitration Policy
- Bottom bar: "© 2025 MeritTrial — Built on GenLayer. Powered by AI."
- Social links (placeholder): Twitter/X, Discord, GitHub
- Nền: slightly lighter than main background (#0f0f18)

---

## TECH STACK
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (v3.4+)
- **Animations:** Framer Motion
- **Fonts:** Inter + JetBrains Mono (Google Fonts)
- **Icons:** Lucide React hoặc emoji-based
- **Deploy target:** Vercel-ready

## IMPLEMENTATION NOTES
1. File structure Next.js chuẩn: app/ directory
2. Tạo reusable components: Navbar, Footer, Section, FeatureCard, StatCard
3. Responsive: mobile-first, breakpoints sm/md/lg/xl
4. Dark mode ONLY — không cần light mode toggle
5. Performance: Next.js Image optimization, font optimization
6. SEO: meta tags cho MeritTrial
7. Animations: subtle, professional — KHÔNG quá nhiều animation làm chậm
8. Không cần backend API — static landing page
9. Email input trong CTA section có thể là form HTML đơn giản
10. Mockup UI trong hero section có thể là một styled div hoặc SVG illustration

## SUCCESS CRITERIA
- Trông giương và cảm nhận giống Cryonix (dark SaaS, glassmorphism, gradient accents)
- Responsive tốt trên mobile/tablet/desktop
- Scroll smooth, animations mượt
- Typography rõ ràng, hierarchy rõ ràng
- CTA buttons nổi bật
- Code block section trông như IDE thật
- Accordion FAQ hoạt động với click
- Tất cả nội dung tiếng Anh chuyên nghiệp, persuasive copywriting
- Bias-free messaging is consistent throughout — emphasize fairness, skills-based, anonymized

Build this as a production-ready landing page + smart contract. Tạo full file structure, đầy đủ components, styling, animations, và responsive design.
