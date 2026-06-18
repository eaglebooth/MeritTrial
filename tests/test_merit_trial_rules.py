import ast
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / "MeritTrial.py"
SOURCE = CONTRACT.read_text(encoding="utf-8")
TREE = ast.parse(SOURCE)
CONTRACT_CLASS = TREE.body[-1]

VALID_RETURN_TYPES = {"typing.Any", "str", "u256"}
VALID_ARG_TYPES = {"u256", "str", "typing.Any"}
FORBIDDEN_IMPORTS = {"os", "time", "random", "requests", "httpx", "aiohttp", "subprocess"}


def annotation_name(annotation):
    return ast.unparse(annotation) if annotation is not None else None


def public_methods():
    for node in CONTRACT_CLASS.body:
        if isinstance(node, ast.FunctionDef) and node.decorator_list:
            decorator_names = [ast.unparse(dec) for dec in node.decorator_list]
            if any(name.startswith("gl.public") for name in decorator_names):
                yield node


class MeritTrialRulesTest(unittest.TestCase):
    def test_required_header_and_imports(self):
        lines = SOURCE.splitlines()
        self.assertEqual(lines[0], "# v0.2.16")
        self.assertEqual(lines[1], '# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }')
        self.assertEqual(lines[2], "from genlayer import *")
        self.assertEqual(lines[3], "import typing")
        self.assertEqual(lines[4], "import json")

    def test_only_allowed_imports(self):
        imports = []
        for node in ast.walk(TREE):
            if isinstance(node, ast.Import):
                imports.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom):
                imports.append(node.module or "")

        self.assertFalse(set(imports) & FORBIDDEN_IMPORTS)
        self.assertIn("genlayer", imports)
        self.assertIn("typing", imports)
        self.assertIn("json", imports)

    def test_public_method_signatures_are_flat_and_typed(self):
        for method in public_methods():
            args = [arg.arg for arg in method.args.args]
            self.assertLessEqual(len(args) - 1, 6, method.name)

            for arg in method.args.args[1:]:
                self.assertIn(annotation_name(arg.annotation), VALID_ARG_TYPES, (method.name, arg.arg))
            self.assertIn(annotation_name(method.returns), VALID_RETURN_TYPES, method.name)
            self.assertNotIn("int", [annotation_name(arg.annotation) for arg in method.args.args])
            self.assertNotIn("float", [annotation_name(arg.annotation) for arg in method.args.args])
            self.assertNotIn("bool", [annotation_name(arg.annotation) for arg in method.args.args])

    def test_storage_fields_use_only_persistent_types(self):
        allowed_annotations = {
            "TreeMap[u256, str]",
            "TreeMap[u256, u256]",
            "DynArray[str]",
            "DynArray[u256]",
            "u256",
        }

        for node in CONTRACT_CLASS.body:
            if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
                self.assertIn(annotation_name(node.annotation), allowed_annotations, node.target.id)

    def test_no_forbidden_time_or_random_dependencies(self):
        forbidden_calls = ["time.time", "os.getenv", "random", "id("]
        for token in forbidden_calls:
            self.assertNotIn(token, SOURCE)

    def test_no_hardcoded_challenge_block_or_deadline_storage(self):
        self.assertNotIn("current_block = u256(0)", SOURCE)
        self.assertNotIn("app_challenge_deadline", SOURCE)
        self.assertNotIn("challenge_timestamps", SOURCE)

    def test_create_job_signature_has_six_args_and_fund_job_exists(self):
        methods = {method.name: method for method in public_methods()}
        self.assertEqual(len(methods["create_job"].args.args), 7)
        self.assertIn("fund_job", methods)
        self.assertEqual(len(methods["fund_job"].args.args), 3)

    def test_nondeterminism_uses_local_functions_and_strict_eq(self):
        self.assertIn("def run_evaluation() -> str:", SOURCE)
        self.assertIn("gl.eq_principle.strict_eq(run_evaluation)", SOURCE)
        self.assertIn("def panelist_1() -> str:", SOURCE)
        self.assertIn("def panelist_2() -> str:", SOURCE)
        self.assertIn("def panelist_3() -> str:", SOURCE)
        self.assertIn("gl.eq_principle.strict_eq(panelist_1)", SOURCE)
        self.assertIn("gl.eq_principle.strict_eq(panelist_2)", SOURCE)
        self.assertIn("gl.eq_principle.strict_eq(panelist_3)", SOURCE)

    def test_fee_collection_happens_after_successful_json_parse(self):
        balance_write = SOURCE.index("self.job_balance[job_id] = new_balance")
        json_parse = SOURCE.index("data = json.loads(evaluation_json)")
        invalid_score = SOURCE.index("return \"INVALID_SCORE\"")
        self.assertLess(json_parse, invalid_score)
        self.assertLess(invalid_score, balance_write)

    def test_challenge_records_are_created_after_panel_json_validation(self):
        challenge_append = SOURCE.index("self.challenge_app_ids.append(application_id)")
        panel_validation = SOURCE.index("INVALID_PANEL_EVALUATION")
        self.assertLess(panel_validation, challenge_append)


if __name__ == "__main__":
    unittest.main()
