from fastapi import APIRouter
from ..models.schemas import RecordComparisonRequest, ComparisonResult, ComparisonDifference
from ..services.conflict_detection import detect_record_conflicts

router = APIRouter(prefix="/comparison", tags=["Comparison"])

@router.post("/compare-records", response_model=ComparisonResult)
async def compare_records(payload: RecordComparisonRequest):
    conflicts = detect_record_conflicts(payload.recordA, payload.recordB)
    diffs = [
        ComparisonDifference(
            field=c["field"],
            recordA=c["recordA"],
            recordB=c["recordB"],
            match=c["match"],
            severity=c["severity"]
        )
        for c in conflicts
    ]

    has_diff = any(not d.match for d in diffs)
    summary = (
        f"Potential inconsistency detected across {sum(1 for d in diffs if not d.match)} fields between Record A and Record B."
        if has_diff else "All verified attributes match consistently."
    )

    return ComparisonResult(
        hasInconsistency=has_diff,
        summary=summary,
        differences=diffs,
        recommendation="Official human verification must be performed. AI does not modify statutory titles."
    )
