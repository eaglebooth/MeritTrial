# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import typing
import json


class MeritTrial(gl.Contract):
    # ── Job Posting Storage ───────────────────────────────────────
    job_titles: TreeMap[u256, str]
    job_descriptions: TreeMap[u256, str]
    job_requirements: TreeMap[u256, str]
    job_company: TreeMap[u256, str]
    job_status: TreeMap[u256, str]
    job_evaluation_fee: TreeMap[u256, u256]
    job_challenge_window: TreeMap[u256, u256]
    job_balance: TreeMap[u256, u256]
    job_count: u256

    # ── Candidate Application Storage ────────────────────────────
    app_job_ids: TreeMap[u256, u256]
    app_candidate_id: TreeMap[u256, str]
    app_resume_url: TreeMap[u256, str]
    app_github_url: TreeMap[u256, str]
    app_portfolio_url: TreeMap[u256, str]
    app_code_challenge_url: TreeMap[u256, str]
    app_cover_letter_url: TreeMap[u256, str]
    app_status: TreeMap[u256, str]
    app_evaluation_json: TreeMap[u256, str]
    app_tech_rating: TreeMap[u256, u256]
    app_skills_match: TreeMap[u256, str]
    app_recommendation: TreeMap[u256, str]
    app_confidence: TreeMap[u256, u256]
    app_created_at: TreeMap[u256, u256]
    app_evaluated_at: TreeMap[u256, u256]
    app_count: u256

    # ── Challenge Storage ────────────────────────────────────────
    challenge_app_ids: DynArray[u256]
    challenge_reasons: DynArray[str]
    challenge_panel_verdicts: DynArray[str]
    challenge_outcome: DynArray[str]
    challenge_count: u256

    # ── Treasury / Platform Revenue ──────────────────────────────
    treasury_recipients: DynArray[str]
    treasury_amounts: DynArray[u256]
    treasury_types: DynArray[str]
    treasury_timestamps: DynArray[u256]
    treasury_count: u256

    def __init__(self):
        self.job_count = u256(0)
        self.app_count = u256(0)
        self.challenge_count = u256(0)
        self.treasury_count = u256(0)


    # ── Job Management ───────────────────────────────────────────

    @gl.public.write
    def create_job(
        self,
        title: str,
        description: str,
        requirements_json: str,
        company: str,
        evaluation_fee: u256,
        challenge_window_blocks: u256,
    ) -> typing.Any:
        if len(title) == 0:
            return "NO_TITLE"
        if len(description) == 0:
            return "NO_DESCRIPTION"
        if len(company) == 0:
            return "NO_COMPANY"
        if evaluation_fee == u256(0):
            return "ZERO_FEE"

        job_id = self.job_count
        self.job_titles[job_id] = title
        self.job_descriptions[job_id] = description
        self.job_requirements[job_id] = requirements_json
        self.job_company[job_id] = company
        self.job_status[job_id] = "OPEN"
        self.job_evaluation_fee[job_id] = evaluation_fee
        self.job_challenge_window[job_id] = challenge_window_blocks
        self.job_balance[job_id] = u256(0)
        self.job_count = job_id + u256(1)
        return job_id

    @gl.public.write
    def fund_job(self, job_id: u256, amount: u256) -> str:
        if job_id >= self.job_count:
            return "INVALID_ID"
        if amount == u256(0):
            return "ZERO_FUNDING"

        self.job_balance[job_id] = self.job_balance[job_id] + amount
        return "FUNDED"

    @gl.public.view
    def get_job(self, job_id: u256) -> str:
        title = self.job_titles[job_id]
        description = self.job_descriptions[job_id]
        requirements = self.job_requirements[job_id]
        company = self.job_company[job_id]
        status = self.job_status[job_id]
        evaluation_fee = self.job_evaluation_fee[job_id]
        challenge_window = self.job_challenge_window[job_id]
        balance = self.job_balance[job_id]
        result = json.dumps({
            "job_id": int(job_id),
            "title": title,
            "description": description,
            "requirements": requirements,
            "company": company,
            "status": status,
            "evaluation_fee": int(evaluation_fee),
            "challenge_window_blocks": int(challenge_window),
            "balance": int(balance),
        }, sort_keys=True, separators=(",", ":"))
        return result

    @gl.public.view
    def get_job_count(self) -> u256:
        return self.job_count

    @gl.public.view
    def get_job_status(self, job_id: u256) -> str:
        return self.job_status[job_id]


    # ── Candidate Application ────────────────────────────────────

    @gl.public.write
    def submit_application(
        self,
        job_id: u256,
        candidate_id: str,
        resume_url: str,
        github_url: str,
        portfolio_url: str,
        code_challenge_url: str,
    ) -> typing.Any:
        if job_id >= self.job_count:
            return "INVALID_ID"
        if self.job_status[job_id] != "OPEN":
            return "JOB_CLOSED"
        if len(candidate_id) == 0:
            return "NO_CANDIDATE_ID"
        has_url = (
            len(resume_url) > 0
            or len(github_url) > 0
            or len(portfolio_url) > 0
            or len(code_challenge_url) > 0
        )
        if not has_url:
            return "NO_EVIDENCE_URLS"

        application_id = self.app_count
        self.app_job_ids[application_id] = job_id
        self.app_candidate_id[application_id] = candidate_id
        self.app_resume_url[application_id] = resume_url
        self.app_github_url[application_id] = github_url
        self.app_portfolio_url[application_id] = portfolio_url
        self.app_code_challenge_url[application_id] = code_challenge_url
        self.app_cover_letter_url[application_id] = ""
        self.app_status[application_id] = "PENDING"
        self.app_evaluation_json[application_id] = ""
        self.app_tech_rating[application_id] = u256(0)
        self.app_skills_match[application_id] = ""
        self.app_recommendation[application_id] = ""
        self.app_confidence[application_id] = u256(0)
        self.app_created_at[application_id] = u256(0)
        self.app_evaluated_at[application_id] = u256(0)
        self.app_count = application_id + u256(1)
        return application_id

    @gl.public.write
    def attach_cover_letter(self, application_id: u256, cover_letter_url: str) -> str:
        if application_id >= self.app_count:
            return "INVALID_ID"
        if self.app_status[application_id] != "PENDING":
            return "INVALID_STATUS"
        if len(cover_letter_url) == 0:
            return "NO_COVER_LETTER_URL"

        self.app_cover_letter_url[application_id] = cover_letter_url
        return "ATTACHED"

    @gl.public.view
    def get_application(self, application_id: u256) -> str:
        job_id = self.app_job_ids[application_id]
        candidate_id = self.app_candidate_id[application_id]
        resume_url = self.app_resume_url[application_id]
        github_url = self.app_github_url[application_id]
        portfolio_url = self.app_portfolio_url[application_id]
        code_challenge_url = self.app_code_challenge_url[application_id]
        cover_letter_url = self.app_cover_letter_url[application_id]
        status = self.app_status[application_id]
        evaluation_json = self.app_evaluation_json[application_id]
        tech_rating = self.app_tech_rating[application_id]
        skills_match = self.app_skills_match[application_id]
        recommendation = self.app_recommendation[application_id]
        confidence = self.app_confidence[application_id]
        created_at = self.app_created_at[application_id]
        evaluated_at = self.app_evaluated_at[application_id]
        result = json.dumps({
            "application_id": int(application_id),
            "job_id": int(job_id),
            "candidate_id": candidate_id,
            "resume_url": resume_url,
            "github_url": github_url,
            "portfolio_url": portfolio_url,
            "code_challenge_url": code_challenge_url,
            "cover_letter_url": cover_letter_url,
            "status": status,
            "evaluation_json": evaluation_json,
            "tech_rating": int(tech_rating),
            "skills_match": skills_match,
            "recommendation": recommendation,
            "confidence": int(confidence),
            "created_at": int(created_at),
            "evaluated_at": int(evaluated_at),
        }, sort_keys=True, separators=(",", ":"))
        return result

    @gl.public.view
    def get_application_count(self) -> u256:
        return self.app_count


    # ── AI Evaluation (Core) ─────────────────────────────────────

    @gl.public.write
    def evaluate_application(self, application_id: u256) -> str:
        if application_id >= self.app_count:
            return "INVALID_ID"
        current_status = self.app_status[application_id]
        if current_status != "PENDING":
            return "ALREADY_EVALUATED"

        job_id = self.app_job_ids[application_id]
        job_requirements = self.job_requirements[job_id]
        resume_url = self.app_resume_url[application_id]
        github_url = self.app_github_url[application_id]
        portfolio_url = self.app_portfolio_url[application_id]
        code_challenge_url = self.app_code_challenge_url[application_id]
        cover_letter_url = self.app_cover_letter_url[application_id]

        def truncate(text: str, limit: int) -> str:
            if len(text) > limit:
                return text[:limit]
            return text

        def run_evaluation() -> str:
            resume_content = ""
            if len(resume_url) > 0:
                resp = gl.nondet.web.get(resume_url)
                resume_content = resp.body.decode("utf-8")
            github_content = ""
            if len(github_url) > 0:
                resp = gl.nondet.web.get(github_url)
                github_content = resp.body.decode("utf-8")
            portfolio_content = ""
            if len(portfolio_url) > 0:
                resp = gl.nondet.web.get(portfolio_url)
                portfolio_content = resp.body.decode("utf-8")
            code_challenge_content = ""
            if len(code_challenge_url) > 0:
                resp = gl.nondet.web.get(code_challenge_url)
                code_challenge_content = resp.body.decode("utf-8")
            cover_letter_content = ""
            if len(cover_letter_url) > 0:
                resp = gl.nondet.web.get(cover_letter_url)
                cover_letter_content = resp.body.decode("utf-8")

            resume_content = truncate(resume_content, 4000)
            github_content = truncate(github_content, 4000)
            portfolio_content = truncate(portfolio_content, 4000)
            code_challenge_content = truncate(code_challenge_content, 4000)
            cover_letter_content = truncate(cover_letter_content, 4000)

            evaluation_prompt = (
                "You are a technical talent evaluator AI for a decentralized hiring platform called MeritTrial.\n"
                "Your ONLY task: assess whether this candidate's skills match the job requirements.\n\n"
                "BIAS-FREE EVALUATION RULES (MUST FOLLOW):\n"
                "- IGNORE completely: name, gender, age, university pedigree, location, nationality, ethnicity, accent, appearance\n"
                "- FOCUS ONLY ON: proof-of-work, code quality, problem-solving skills, communication ability, experience depth\n"
                "- If evidence contains demographic info, explicitly disregard it in your analysis\n\n"
                "JOB REQUIREMENTS:\n"
                + job_requirements + "\n\n"
                "CANDIDATE EVIDENCE:\n\n"
                "--- RESUME ---\n"
                "URL: " + resume_url + "\n"
                + resume_content + "\n\n"
                "--- GITHUB PROFILE ---\n"
                "URL: " + github_url + "\n"
                + github_content + "\n\n"
                "--- PORTFOLIO ---\n"
                "URL: " + portfolio_url + "\n"
                + portfolio_content + "\n\n"
                "--- CODE CHALLENGE ---\n"
                "URL: " + code_challenge_url + "\n"
                + code_challenge_content + "\n\n"
                "--- COVER LETTER ---\n"
                "URL: " + cover_letter_url + "\n"
                + cover_letter_content + "\n\n"
                "Evaluate based ONLY on the evidence above. Score each criterion 0-100:\n"
                "1. technical_rating: Overall technical capability (0-100)\n"
                "2. skills_match: {\"required\": [...], \"matched\": [...], \"missing\": [...], \"match_percentage\": N}\n"
                "3. code_quality: Assessment of code quality from GitHub/challenge (POOR / FAIR / GOOD / EXCELLENT)\n"
                "4. experience_depth: How deep is their demonstrated experience (0-100)\n"
                "5. communication: Quality of documentation, READMEs, explanations (0-100)\n"
                "6. problem_solving: Evidence of algorithmic thinking, architecture decisions (0-100)\n"
                "7. red_flags: [list of concerns like \"inconsistent timeline\", \"vague descriptions\", \"copy-paste code patterns\"]\n"
                "8. strengths: [list of standout qualities]\n"
                "9. recommendation: STRONG_HIRE / HIRE / REVIEW / NO_HIRE\n"
                "10. confidence: Your confidence in this evaluation (1-10)\n"
                "11. evidence_summary: What specific evidence supports this rating?\n\n"
                "Respond with ONLY this JSON, no other text or explanation:\n"
                '{"technical_rating":N,"skills_match":{"required":[],"matched":[],"missing":[],"match_percentage":N},"code_quality":"...","experience_depth":N,"communication":N,"problem_solving":N,"red_flags":[],"strengths":[],"recommendation":"...","confidence":N,"evidence_summary":"..."}'
            )
            llm_response = gl.nondet.exec_prompt(evaluation_prompt)
            cleaned = llm_response.replace("```json", "").replace("```", "").strip()
            return cleaned

        evaluation_json = gl.eq_principle.strict_eq(run_evaluation)
        try:
            data = json.loads(evaluation_json)
        except Exception:
            return "INVALID_EVALUATION"
        if "technical_rating" not in data or "skills_match" not in data or "recommendation" not in data or "confidence" not in data:
            return "INVALID_EVALUATION"

        recommendation = str(data["recommendation"])
        if recommendation not in ["STRONG_HIRE", "HIRE", "REVIEW", "NO_HIRE"]:
            return "INVALID_RECOMMENDATION"

        technical_rating = int(data["technical_rating"])
        confidence = int(data["confidence"])
        if technical_rating < 0 or technical_rating > 100 or confidence < 1 or confidence > 10:
            return "INVALID_SCORE"

        evaluation_fee = self.job_evaluation_fee[job_id]
        current_balance = self.job_balance[job_id]
        if evaluation_fee == u256(0):
            return "ZERO_FEE"
        if current_balance < evaluation_fee:
            return "INSUFFICIENT_BALANCE"
        new_balance = current_balance - evaluation_fee
        self.job_balance[job_id] = new_balance

        treasury_idx = self.treasury_count
        self.treasury_recipients.append("platform")
        self.treasury_amounts.append(evaluation_fee)
        self.treasury_types.append("EVALUATION_FEE")
        self.treasury_timestamps.append(u256(0))
        self.treasury_count = treasury_idx + u256(1)

        self.app_tech_rating[application_id] = u256(technical_rating)
        self.app_skills_match[application_id] = json.dumps(data["skills_match"], sort_keys=True, separators=(",", ":"))
        self.app_recommendation[application_id] = str(data["recommendation"])
        self.app_confidence[application_id] = u256(int(data["confidence"]))
        self.app_evaluation_json[application_id] = evaluation_json
        self.app_status[application_id] = "EVALUATED"
        self.app_evaluated_at[application_id] = u256(0)
        return evaluation_json


    # ── Challenge Mechanism ──────────────────────────────────────

    @gl.public.write
    def challenge_evaluation(self, application_id: u256, reason: str) -> str:
        if application_id >= self.app_count:
            return "INVALID_ID"
        current_status = self.app_status[application_id]
        if current_status != "EVALUATED":
            return "INVALID_STATUS"

        if len(reason) == 0:
            return "NO_CHALLENGE_REASON"

        job_id = self.app_job_ids[application_id]
        job_requirements = self.job_requirements[job_id]
        resume_url = self.app_resume_url[application_id]
        github_url = self.app_github_url[application_id]
        portfolio_url = self.app_portfolio_url[application_id]
        code_challenge_url = self.app_code_challenge_url[application_id]
        cover_letter_url = self.app_cover_letter_url[application_id]
        original_evaluation = self.app_evaluation_json[application_id]

        def truncate(text: str, limit: int) -> str:
            if len(text) > limit:
                return text[:limit]
            return text

        def panelist_1() -> str:
            resume_content = ""
            if len(resume_url) > 0:
                resp = gl.nondet.web.get(resume_url)
                resume_content = resp.body.decode("utf-8")
            github_content = ""
            if len(github_url) > 0:
                resp = gl.nondet.web.get(github_url)
                github_content = resp.body.decode("utf-8")
            portfolio_content = ""
            if len(portfolio_url) > 0:
                resp = gl.nondet.web.get(portfolio_url)
                portfolio_content = resp.body.decode("utf-8")
            code_challenge_content = ""
            if len(code_challenge_url) > 0:
                resp = gl.nondet.web.get(code_challenge_url)
                code_challenge_content = resp.body.decode("utf-8")
            cover_letter_content = ""
            if len(cover_letter_url) > 0:
                resp = gl.nondet.web.get(cover_letter_url)
                cover_letter_content = resp.body.decode("utf-8")

            resume_content = truncate(resume_content, 4000)
            github_content = truncate(github_content, 4000)
            portfolio_content = truncate(portfolio_content, 4000)
            code_challenge_content = truncate(code_challenge_content, 4000)
            cover_letter_content = truncate(cover_letter_content, 4000)

            prompt = (
                "You are a senior technical interviewer reviewing an AI evaluation of a candidate.\n"
                "Your task: independently re-evaluate this candidate and decide if the original verdict should be UPHELD or OVERTURNED.\n\n"
                "BIAS-FREE RULES:\n"
                "- IGNORE: name, gender, age, university, location, nationality, ethnicity\n"
                "- FOCUS ONLY ON: proof-of-work, code quality, problem-solving, communication, experience depth\n\n"
                "JOB REQUIREMENTS:\n"
                + job_requirements + "\n\n"
                "ORIGINAL EVALUATION:\n"
                + original_evaluation + "\n\n"
                "CHALLENGE REASON:\n"
                + reason + "\n\n"
                "CANDIDATE EVIDENCE:\n\n"
                "--- RESUME ---\n"
                "URL: " + resume_url + "\n"
                + resume_content + "\n\n"
                "--- GITHUB ---\n"
                "URL: " + github_url + "\n"
                + github_content + "\n\n"
                "--- PORTFOLIO ---\n"
                "URL: " + portfolio_url + "\n"
                + portfolio_content + "\n\n"
                "--- CODE CHALLENGE ---\n"
                "URL: " + code_challenge_url + "\n"
                + code_challenge_content + "\n\n"
                "--- COVER LETTER ---\n"
                "URL: " + cover_letter_url + "\n"
                + cover_letter_content + "\n\n"
                "Based on your independent review, respond with ONLY this JSON:\n"
                '{"verdict":"UPHELD|OVERTURNED","technical_rating":N,"recommendation":"STRONG_HIRE|HIRE|REVIEW|NO_HIRE","confidence":N,"reasoning":"..."}'
            )
            return gl.nondet.exec_prompt(prompt)

        def panelist_2() -> str:
            resume_content = ""
            if len(resume_url) > 0:
                resp = gl.nondet.web.get(resume_url)
                resume_content = resp.body.decode("utf-8")
            github_content = ""
            if len(github_url) > 0:
                resp = gl.nondet.web.get(github_url)
                github_content = resp.body.decode("utf-8")
            portfolio_content = ""
            if len(portfolio_url) > 0:
                resp = gl.nondet.web.get(portfolio_url)
                portfolio_content = resp.body.decode("utf-8")
            code_challenge_content = ""
            if len(code_challenge_url) > 0:
                resp = gl.nondet.web.get(code_challenge_url)
                code_challenge_content = resp.body.decode("utf-8")
            cover_letter_content = ""
            if len(cover_letter_url) > 0:
                resp = gl.nondet.web.get(cover_letter_url)
                cover_letter_content = resp.body.decode("utf-8")

            resume_content = truncate(resume_content, 4000)
            github_content = truncate(github_content, 4000)
            portfolio_content = truncate(portfolio_content, 4000)
            code_challenge_content = truncate(code_challenge_content, 4000)
            cover_letter_content = truncate(cover_letter_content, 4000)

            prompt = (
                "You are an independent HR expert auditing a candidate assessment for fairness and accuracy.\n"
                "Your task: independently review this candidate evaluation and decide UPHELD or OVERTURNED.\n\n"
                "BIAS-FREE RULES:\n"
                "- IGNORE: name, gender, age, university, location, nationality, ethnicity\n"
                "- FOCUS ONLY ON: proof-of-work, code quality, problem-solving, communication, experience depth\n\n"
                "JOB REQUIREMENTS:\n"
                + job_requirements + "\n\n"
                "ORIGINAL EVALUATION:\n"
                + original_evaluation + "\n\n"
                "CHALLENGE REASON:\n"
                + reason + "\n\n"
                "CANDIDATE EVIDENCE:\n\n"
                "--- RESUME ---\n"
                "URL: " + resume_url + "\n"
                + resume_content + "\n\n"
                "--- GITHUB ---\n"
                "URL: " + github_url + "\n"
                + github_content + "\n\n"
                "--- PORTFOLIO ---\n"
                "URL: " + portfolio_url + "\n"
                + portfolio_content + "\n\n"
                "--- CODE CHALLENGE ---\n"
                "URL: " + code_challenge_url + "\n"
                + code_challenge_content + "\n\n"
                "--- COVER LETTER ---\n"
                "URL: " + cover_letter_url + "\n"
                + cover_letter_content + "\n\n"
                "Based on your independent audit, respond with ONLY this JSON:\n"
                '{"verdict":"UPHELD|OVERTURNED","technical_rating":N,"recommendation":"STRONG_HIRE|HIRE|REVIEW|NO_HIRE","confidence":N,"reasoning":"..."}'
            )
            return gl.nondet.exec_prompt(prompt)

        def panelist_3() -> str:
            resume_content = ""
            if len(resume_url) > 0:
                resp = gl.nondet.web.get(resume_url)
                resume_content = resp.body.decode("utf-8")
            github_content = ""
            if len(github_url) > 0:
                resp = gl.nondet.web.get(github_url)
                github_content = resp.body.decode("utf-8")
            portfolio_content = ""
            if len(portfolio_url) > 0:
                resp = gl.nondet.web.get(portfolio_url)
                portfolio_content = resp.body.decode("utf-8")
            code_challenge_content = ""
            if len(code_challenge_url) > 0:
                resp = gl.nondet.web.get(code_challenge_url)
                code_challenge_content = resp.body.decode("utf-8")
            cover_letter_content = ""
            if len(cover_letter_url) > 0:
                resp = gl.nondet.web.get(cover_letter_url)
                cover_letter_content = resp.body.decode("utf-8")

            resume_content = truncate(resume_content, 4000)
            github_content = truncate(github_content, 4000)
            portfolio_content = truncate(portfolio_content, 4000)
            code_challenge_content = truncate(code_challenge_content, 4000)
            cover_letter_content = truncate(cover_letter_content, 4000)

            prompt = (
                "You are a technical lead assessing candidate fit for a specific role.\n"
                "Your task: independently evaluate this candidate and decide if the original verdict should be UPHELD or OVERTURNED.\n\n"
                "BIAS-FREE RULES:\n"
                "- IGNORE: name, gender, age, university, location, nationality, ethnicity\n"
                "- FOCUS ONLY ON: proof-of-work, code quality, problem-solving, communication, experience depth\n\n"
                "JOB REQUIREMENTS:\n"
                + job_requirements + "\n\n"
                "ORIGINAL EVALUATION:\n"
                + original_evaluation + "\n\n"
                "CHALLENGE REASON:\n"
                + reason + "\n\n"
                "CANDIDATE EVIDENCE:\n\n"
                "--- RESUME ---\n"
                "URL: " + resume_url + "\n"
                + resume_content + "\n\n"
                "--- GITHUB ---\n"
                "URL: " + github_url + "\n"
                + github_content + "\n\n"
                "--- PORTFOLIO ---\n"
                "URL: " + portfolio_url + "\n"
                + portfolio_content + "\n\n"
                "--- CODE CHALLENGE ---\n"
                "URL: " + code_challenge_url + "\n"
                + code_challenge_content + "\n\n"
                "--- COVER LETTER ---\n"
                "URL: " + cover_letter_url + "\n"
                + cover_letter_content + "\n\n"
                "Based on your independent assessment, respond with ONLY this JSON:\n"
                '{"verdict":"UPHELD|OVERTURNED","technical_rating":N,"recommendation":"STRONG_HIRE|HIRE|REVIEW|NO_HIRE","confidence":N,"reasoning":"..."}'
            )
            return gl.nondet.exec_prompt(prompt)

        verdict_1_raw = gl.eq_principle.strict_eq(panelist_1)
        verdict_2_raw = gl.eq_principle.strict_eq(panelist_2)
        verdict_3_raw = gl.eq_principle.strict_eq(panelist_3)

        try:
            verdict_1 = json.loads(verdict_1_raw)
            verdict_2 = json.loads(verdict_2_raw)
            verdict_3 = json.loads(verdict_3_raw)
        except Exception:
            return "INVALID_PANEL_EVALUATION"

        panel_verdicts_list = [verdict_1, verdict_2, verdict_3]
        for panel_verdict in panel_verdicts_list:
            if "verdict" not in panel_verdict or "technical_rating" not in panel_verdict or "recommendation" not in panel_verdict or "confidence" not in panel_verdict:
                return "INVALID_PANEL_EVALUATION"
            if str(panel_verdict["verdict"]) not in ["UPHELD", "OVERTURNED"]:
                return "INVALID_VERDICT"

        overturned_count = u256(0)
        if str(verdict_1["verdict"]) == "OVERTURNED":
            overturned_count = overturned_count + u256(1)
        if str(verdict_2["verdict"]) == "OVERTURNED":
            overturned_count = overturned_count + u256(1)
        if str(verdict_3["verdict"]) == "OVERTURNED":
            overturned_count = overturned_count + u256(1)

        challenge_idx = self.challenge_count
        self.challenge_app_ids.append(application_id)
        self.challenge_reasons.append(reason)
        self.challenge_panel_verdicts.append("")
        self.challenge_outcome.append("")
        self.challenge_count = challenge_idx + u256(1)

        panel_verdicts = json.dumps([
            {"verdict": str(verdict_1["verdict"]), "technical_rating": int(verdict_1["technical_rating"]), "recommendation": str(verdict_1["recommendation"]), "confidence": int(verdict_1["confidence"])},
            {"verdict": str(verdict_2["verdict"]), "technical_rating": int(verdict_2["technical_rating"]), "recommendation": str(verdict_2["recommendation"]), "confidence": int(verdict_2["confidence"])},
            {"verdict": str(verdict_3["verdict"]), "technical_rating": int(verdict_3["technical_rating"]), "recommendation": str(verdict_3["recommendation"]), "confidence": int(verdict_3["confidence"])},
        ], sort_keys=True, separators=(",", ":"))

        self.challenge_panel_verdicts[challenge_idx] = panel_verdicts

        if overturned_count >= u256(2):
            selected_verdict = verdict_1
            if str(verdict_1["verdict"]) != "OVERTURNED":
                selected_verdict = verdict_2
            if str(verdict_2["verdict"]) != "OVERTURNED":
                selected_verdict = verdict_3
            self.app_tech_rating[application_id] = u256(int(selected_verdict["technical_rating"]))
            self.app_recommendation[application_id] = str(selected_verdict["recommendation"])
            self.app_confidence[application_id] = u256(int(selected_verdict["confidence"]))
            self.app_evaluation_json[application_id] = json.dumps(selected_verdict, sort_keys=True, separators=(",", ":"))
            self.app_status[application_id] = "FINALIZED"
            self.challenge_outcome[challenge_idx] = "OVERTURNED"
        else:
            self.app_status[application_id] = "FINALIZED"
            self.challenge_outcome[challenge_idx] = "UPHELD"

        return self.app_status[application_id]


    # ── Finalize ─────────────────────────────────────────────────

    @gl.public.write
    def finalize_evaluation(self, application_id: u256) -> str:
        if application_id >= self.app_count:
            return "INVALID_ID"
        current_status = self.app_status[application_id]
        if current_status != "EVALUATED":
            return "INVALID_STATUS"
        self.app_status[application_id] = "FINALIZED"
        return "FINALIZED"


    # ── Query Functions ──────────────────────────────────────────

    @gl.public.view
    def get_evaluation(self, application_id: u256) -> str:
        return self.app_evaluation_json[application_id]

    @gl.public.view
    def get_recommendation(self, application_id: u256) -> str:
        return self.app_recommendation[application_id]

    @gl.public.view
    def get_tech_rating(self, application_id: u256) -> u256:
        return self.app_tech_rating[application_id]

    @gl.public.view
    def get_application_status(self, application_id: u256) -> str:
        return self.app_status[application_id]

    @gl.public.view
    def get_challenge_count(self) -> u256:
        return self.challenge_count

    @gl.public.view
    def get_treasury_count(self) -> u256:
        return self.treasury_count

    @gl.public.view
    def get_treasury_record(self, index: u256) -> str:
        recipient = self.treasury_recipients[index]
        amount = self.treasury_amounts[index]
        t_type = self.treasury_types[index]
        timestamp = self.treasury_timestamps[index]
        result = json.dumps({
            "index": int(index),
            "recipient": recipient,
            "amount": int(amount),
            "type": t_type,
            "timestamp": int(timestamp),
        }, sort_keys=True, separators=(",", ":"))
        return result
