from fastapi import APIRouter
from datetime import datetime
from ..models.schemas import LandRecordInput, ValidationResult, ValidationAnomaly
from ..services.duplicate_detection import find_potential_duplicates
from ..services.spatial_anomaly import detect_spatial_anomalies

router = APIRouter(prefix="/validation", tags=["Validation"])

@router.post("/validate-record", response_model=ValidationResult)
async def validate_record(record: LandRecordInput):
    rec_dict = record.dict()
    anomalies = []

    # 1. Missing Data Check
    if not record.ownerName or len(record.ownerName.strip()) < 3:
        anomalies.append(ValidationAnomaly(
            type="Missing Data",
            severity="Critical",
            field="ownerName",
            explanation="Statutory land owner title is missing or incomplete.",
            confidence=1.0
        ))

    # 2. Known Seed Records for Duplicate / Conflict Testing
    seed_records = [
        {"id": "P-10245", "khasraNo": "142/1", "village": "Badshahpur", "ownerName": "Suresh Kumar Sharma", "areaHectares": 2.45},
        {"id": "P-10246", "khasraNo": "142/2", "village": "Badshahpur", "ownerName": "Rakesh Kumar Sharma", "areaHectares": 2.70},
    ]

    duplicates = find_potential_duplicates(rec_dict, seed_records)
    for d in duplicates:
        anomalies.append(ValidationAnomaly(
            type=d["type"],
            severity=d["severity"],
            confidence=d["confidence"],
            explanation=d["explanation"],
            evidence={"matchedRecordId": d.get("matchedRecordId")}
        ))

    return ValidationResult(
        isValid=len(anomalies) == 0,
        anomaliesCount=len(anomalies),
        anomalies=anomalies,
        validationTimestamp=datetime.utcnow().isoformat()
    )
