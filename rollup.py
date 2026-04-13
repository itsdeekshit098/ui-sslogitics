import json

def rollup(rootJson):
    try:
        data = json.loads(rootJson)
    except Exception:
        return ['{"pass":0,"fail":0,"skip":0}', "NO_TESTS"]
        
    counts = {"pass": 0, "fail": 0, "skip": 0}
    
    def traverse(node):
        if isinstance(node, dict):
            # Check if this node is a test_case
            if node.get("type") == "test_case" and node.get("ignored") is not True:
                has_result = "result" in node
                has_status = "status" in node
                
                if has_result or has_status:
                    # Priority given to 'result' if both exist
                    val = node.get("result") if has_result else node.get("status")
                    
                    if isinstance(val, str):
                        val_lower = val.lower()
                        if val_lower == "pass":
                            counts["pass"] += 1
                        elif val_lower in ["fail", "blocked"]:
                            counts["fail"] += 1
                        elif val_lower == "skip":
                            counts["skip"] += 1
                        else:
                            counts["skip"] += 1 # Any other non-string or unknown string -> skip
                    else:
                        counts["skip"] += 1 # Non-string -> skip
            
            # Recurse deeper into children
            for v in node.values():
                if isinstance(v, (dict, list)):
                    traverse(v)
                    
        elif isinstance(node, list):
            for item in node:
                if isinstance(item, (dict, list)):
                    traverse(item)

    traverse(data)
    
    p = counts["pass"]
    f = counts["fail"]
    s = counts["skip"]
    
    # Priority evaluation for Overall Status
    if f > 0:
        overall_status = "FAIL"
    elif s > 0:
        overall_status = "PARTIAL"
    elif p > 0:
        overall_status = "PASS"
    else:
        overall_status = "NO_TESTS"
        
    return [
        f'{{"pass":{p},"fail":{f},"skip":{s}}}',
        overall_status
    ]

if __name__ == "__main__":
    # Test cases to verify the code
    t1 = '{"suite":[{"type":"test_case","result":"pass"},{"type":"test_case","ignored":true,"result":"fail"},{"type":"test_case","status":"BLOCKED"}]}'
    t2 = '{"type":"test_case","result":"pass","status":"fail"}'
    t3 = '{"type":"test_case","status":"SKIP"}'
    t4 = '{"suite": {"nested": {"type":"test_case", "result":"UNKNOWN"}}}' # Unknown string -> skip
    t5 = '{"type":"test_case", "result": 123}' # Non string -> skip
    t6 = '{"other_type": "test_case", "status": "pass"}' # Wrong type, should be NO_TESTS
    
    tests = [t1, t2, t3, t4, t5, t6]
    
    for i, t in enumerate(tests, 1):
        print(f"--- Test Case {i} ---")
        print(f"Input: {t}")
        res = rollup(t)
        print("Output:")
        print(res[0])
        print(res[1])
        print()
