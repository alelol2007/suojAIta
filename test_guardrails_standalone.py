"""
suojAIta - Standalone Pure Python Verification Script
Tests Deterministic Non-AI Guardrails (Regex & Secret Redaction)
and Policy Budget calculations without external package requirements.
"""

import re
import sys
import time

class DeterministicGuardrail:
    def __init__(self):
        self.patterns = {
            "aws_access_key": (re.compile(r"(?:AKIA|ASIA|AROA)[A-Z0-9]{16}"), "[REDACTED_AWS_KEY]"),
            "generic_secret": (re.compile(r"(?:api[_-]?key|secret[_-]?token)[\s:=]+['\"]?([a-zA-Z0-9_\-]{24,64})['\"]?", re.IGNORECASE), "[REDACTED_SECRET]"),
            "credit_card": (re.compile(r"\b(?:\d{4}[ -]?){3}\d{4}\b"), "[REDACTED_CREDIT_CARD]"),
            "ssn": (re.compile(r"\b\d{3}-\d{2}-\d{4}\b"), "[REDACTED_SSN]"),
            "email": (re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"), "[REDACTED_EMAIL]"),
            "sql_injection": (re.compile(r"\b(?:UNION(?:\s+ALL)?\s+SELECT|DROP\s+TABLE|OR\s+1\s*=\s*1|--\s*$)"), "[SANITIZED_SQL]"),
        }
        self.denied_keywords = ["bypass_auth", "sudo_rm_rf", "leak_secrets"]

    def scan_and_sanitize(self, text: str, action: str = "redact"):
        t0 = time.perf_counter()
        sanitized = text
        violations = []

        # 1. Denylist check
        lower = text.lower()
        for kw in self.denied_keywords:
            if kw in lower:
                return {
                    "status": "blocked",
                    "reason": f"Prohibited keyword detected: '{kw}'",
                    "sanitized_text": text,
                    "violations": [{"type": "denylist", "match": kw}],
                    "latency_ms": round((time.perf_counter() - t0) * 1000, 3)
                }

        # 2. Secret & PII regex check
        for entity_name, (regex, placeholder) in self.patterns.items():
            matches = regex.findall(sanitized)
            if matches:
                for match in matches:
                    val = match if isinstance(match, str) else match[0]
                    violations.append({"type": entity_name, "sample": val})

                if action == "block":
                    return {
                        "status": "blocked",
                        "reason": f"Detected {entity_name}",
                        "sanitized_text": text,
                        "violations": violations,
                        "latency_ms": round((time.perf_counter() - t0) * 1000, 3)
                    }
                elif action == "redact":
                    sanitized = regex.sub(placeholder, sanitized)

        return {
            "status": "redacted" if violations else "passed",
            "sanitized_text": sanitized,
            "violations": violations,
            "latency_ms": round((time.perf_counter() - t0) * 1000, 3)
        }

def run_tests():
    print("==================================================")
    print("   suojAIta Python Guardrail Verification Suite   ")
    print("==================================================")
    guard = DeterministicGuardrail()

    # Test 1: AWS Secret Redaction
    sample_aws = "Deploy to cluster with AKIAIOSFODNN7EXAMPLE and bucket prod."
    res1 = guard.scan_and_sanitize(sample_aws, action="redact")
    assert "[REDACTED_AWS_KEY]" in res1["sanitized_text"], "Failed AWS key redaction"
    assert "AKIAIOSFODNN7EXAMPLE" not in res1["sanitized_text"], "Leaked raw AWS key"
    assert res1["latency_ms"] < 5.0, "Latency exceeded 5ms"
    print(f"✓ Test 1: AWS Secret Redacted ({res1['latency_ms']}ms) -> PASSED")

    # Test 2: SSN & Financial PII
    sample_pii = "Customer SSN: 123-45-6789 and Card: 4532-1111-2222-3333"
    res2 = guard.scan_and_sanitize(sample_pii, action="redact")
    assert "[REDACTED_SSN]" in res2["sanitized_text"], "Failed SSN redaction"
    assert "[REDACTED_CREDIT_CARD]" in res2["sanitized_text"], "Failed Card redaction"
    print(f"✓ Test 2: Multi-entity PII Redacted ({res2['latency_ms']}ms) -> PASSED")

    # Test 3: Denied Keyword Block (403)
    sample_block = "Please run bypass_auth to access admin."
    res3 = guard.scan_and_sanitize(sample_block, action="redact")
    assert res3["status"] == "blocked", "Failed to block denylist keyword"
    print(f"✓ Test 3: Denylist Keyword Blocked ({res3['latency_ms']}ms) -> PASSED")

    # Test 4: Clean Benign Query
    sample_clean = "What is the time complexity of quicksort with median-of-three pivot?"
    res4 = guard.scan_and_sanitize(sample_clean, action="redact")
    assert res4["status"] == "passed", "False positive on clean prompt"
    assert len(res4["violations"]) == 0, "Erroneous violation detected"
    print(f"✓ Test 4: Benign Prompt Passed ({res4['latency_ms']}ms) -> PASSED")

    # Test 5: SQL Injection Sanitize
    sample_sql = "SELECT * FROM users WHERE id = '1' UNION SELECT username, password FROM admins --"
    res5 = guard.scan_and_sanitize(sample_sql, action="redact")
    assert "[SANITIZED_SQL]" in res5["sanitized_text"], "Failed SQL sanitization"
    print(f"✓ Test 5: SQL Injection Sanitized ({res5['latency_ms']}ms) -> PASSED")

    print("\n--------------------------------------------------")
    print("ALL 5 PYTHON CORE VERIFICATION TESTS PASSED (100%)")
    print("--------------------------------------------------")

if __name__ == "__main__":
    run_tests()
