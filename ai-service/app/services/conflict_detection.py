from typing import List, Dict, Any

def detect_record_conflicts(record_a: Dict[str, Any], record_b: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Compare two conflicting land records and pinpoint contradictory legal attributes."""
    conflicts = []

    fields_to_check = [
        ("Owner Name", "ownerName", "Critical"),
        ("Khasra Number", "khasraNo", "Critical"),
        ("Area Declared", "area", "High"),
        ("Land Use", "landUse", "Medium"),
        ("Village", "village", "High"),
        ("Registration Number", "registrationNo", "High"),
        ("Mutation Reference", "mutationNo", "High"),
    ]

    for label, key, severity in fields_to_check:
        val_a = str(record_a.get(key, "")).strip()
        val_b = str(record_b.get(key, "")).strip()

        if val_a and val_b and val_a.lower() != val_b.lower():
            conflicts.append({
                "field": label,
                "recordA": val_a,
                "recordB": val_b,
                "severity": severity,
                "match": False,
            })
        else:
            conflicts.append({
                "field": label,
                "recordA": val_a or "N/A",
                "recordB": val_b or "N/A",
                "severity": "None",
                "match": True,
            })

    return conflicts
