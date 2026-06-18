# MeritTrial

MeritTrial is a GenLayer Intelligent Contract project for bias-free technical hiring evaluation. Employers post jobs, candidates submit evidence URLs, and the contract runs on-chain AI evaluation with a multi-panelist challenge flow.

## Why MeritTrial needs GenLayer

The core decision is a subjective hiring judgment with real career consequences. The evaluation depends on web evidence and LLM reasoning that a normal deterministic smart contract cannot perform alone. GenLayer provides consensus around the AI judgment instead of letting one off-chain service decide.

## Architecture

```text
MeritTrial/
  MeritTrial.py                  # Intelligent Contract
  frontend/                      # Next.js app connected to deployed contract
  tests/                         # Contract validation tests
```

### Contract state

The contract stores:

- Jobs with title, description, requirements, company, evaluation fee, balance, and status.
- Candidate applications with evidence URLs and AI evaluation results.
- Challenge records with three panelist verdicts and final outcome.
- Treasury records for evaluation fees collected by the platform.

### Evaluation flow

1. Employer creates a job with `create_job`.
2. Employer funds the job with `fund_job`.
3. Candidate submits an application with evidence URLs using `submit_application`.
4. Anyone calls `evaluate_application`.
5. The contract fetches web evidence, runs an LLM prompt inside `gl.eq_principle.strict_eq`, parses the JSON result, deducts the evaluation fee, and stores the result.
6. If the result is disputed, `challenge_evaluation` runs three independent panelists and finalizes based on majority verdict.

## Contract methods

### Write methods

- `create_job(title, description, requirements_json, company, evaluation_fee, challenge_window_blocks) -> typing.Any`
- `fund_job(job_id, amount) -> str`
- `submit_application(job_id, candidate_id, resume_url, github_url, portfolio_url, code_challenge_url) -> typing.Any`
- `attach_cover_letter(application_id, cover_letter_url) -> str`
- `evaluate_application(application_id) -> str`
- `challenge_evaluation(application_id, reason) -> str`
- `finalize_evaluation(application_id) -> str`

### View methods

- `get_job(job_id) -> str`
- `get_job_count() -> u256`
- `get_job_status(job_id) -> str`
- `get_application(application_id) -> str`
- `get_application_count() -> u256`
- `get_evaluation(application_id) -> str`
- `get_recommendation(application_id) -> str`
- `get_tech_rating(application_id) -> u256`
- `get_application_status(application_id) -> str`
- `get_challenge_count() -> u256`
- `get_treasury_count() -> u256`
- `get_treasury_record(index) -> str`

## Error codes

The contract returns explicit string error codes instead of raising exceptions:

- `INVALID_ID`
- `ALREADY_EVALUATED`
- `INVALID_STATUS`
- `NO_TITLE`
- `NO_DESCRIPTION`
- `NO_COMPANY`
- `NO_REQUIREMENTS`
- `ZERO_FEE`
- `ZERO_FUNDING`
- `NO_CANDIDATE_ID`
- `NO_EVIDENCE_URLS`
- `NO_COVER_LETTER_URL`
- `JOB_CLOSED`
- `INSUFFICIENT_BALANCE`
- `INVALID_EVALUATION`
- `INVALID_RECOMMENDATION`
- `INVALID_SCORE`
- `NO_CHALLENGE_REASON`
- `INVALID_PANEL_EVALUATION`
- `INVALID_VERDICT`

## Run the contract locally

```bash
cd MeritTrial
python -c "import ast; ast.parse(open('MeritTrial.py').read())"
genlayer lint MeritTrial.py
```

## Deploy

```bash
cd MeritTrial
genlayer deploy MeritTrial.py --name MeritTrial
```

Copy the deployed address from the CLI output and add it to:

```text
frontend/.env.local
```

```text
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed address>
NEXT_PUBLIC_GENLAYER_RPC=https://rpc.genlayer.com
NEXT_PUBLIC_NETWORK=testnetAsimov
NEXT_PUBLIC_PROJECT_NAME=MeritTrial
```

## Run the frontend

```bash
cd MeritTrial/frontend
npm install
npm run dev
```

Open the local development server URL shown by Next.js.

## Build the frontend

```bash
cd MeritTrial/frontend
npm run build
```

## Tests

Run the contract validation tests:

```bash
cd MeritTrial
python -m unittest tests/test_merit_trial_rules.py
```

The tests cover:

- Header and import rules.
- Storage type restrictions.
- Public method signatures.
- Nondeterminism pattern.
- Fee validation and insufficient balance.
- Challenge panel validation.

## Submission checklist

Before submitting to the Builder Program, confirm:

1. The deployed contract address is wired into `frontend/.env.local`.
2. The live app uses real `genlayer-js` calls, not static mock data.
3. The live app covers create job, submit application, evaluate, challenge, and final result.
4. The GitHub repo has meaningful commit history.
5. A short demo video records the full user flow.
6. The pitch explains why MeritTrial cannot work without GenLayer.
