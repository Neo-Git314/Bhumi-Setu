from typing import List, Dict, Any, Optional
from ..utils.fuzzy_match import string_similarity_ratio, are_phonetically_similar, normalize_text

def find_potential_duplicates(target_record: Dict[str, Any], existing_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Scan existing land records for duplicate titles or suspicious registrations."""
    duplicates = []
    t_owner = target_record.get("ownerName", "")
    t_khasra = str(target_record.get("khasraNo", "")).strip()
    t_village = normalize_text(target_record.get("village", ""))

    for rec in existing_records:
        if rec.get("id") == target_record.get("id"):
            continue

        r_owner = rec.get("ownerName", "")
        r_khasra = str(rec.get("khasraNo", "")).strip()
        r_village = normalize_text(rec.get("village", ""))

        # Check Village match
        if t_village and r_village and t_village != r_village:
            continue

        # Rule 1: Exact Khasra match in same village with different or slightly variant owner
        if t_khasra and r_khasra and t_khasra == r_khasra:
            sim = string_similarity_ratio(t_owner, r_owner)
            duplicates.append({
                "type": "Duplicate Khasra Registry",
                "severity": "Critical",
                "confidence": round(0.85 + (sim * 0.12), 2),
                "matchedRecordId": rec.get("id"),
                "explanation": f"Khasra number '{t_khasra}' is already registered under '{r_owner}'. Target claim lists '{t_owner}'.",
                "similarityScore": sim,
            })
            continue

        # Rule 2: Near owner name similarity + phonetic resemblance in same village
        sim_name = string_similarity_ratio(t_owner, r_owner)
        if sim_name > 0.80 or are_phonetically_similar(t_owner, r_owner):
            duplicates.append({
                "type": "Phonetic / Name Duplicate",
                "severity": "High",
                "confidence": round(sim_name, 2),
                "matchedRecordId": rec.get("id"),
                "explanation": f"High lexical resemblance detected between owner '{t_owner}' and existing record holder '{r_owner}'.",
                "similarityScore": sim_name,
            })

    return duplicates
