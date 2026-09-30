from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LandRecordInput(BaseModel):
    id: Optional[str] = None
    khasraNo: str
    khataNo: Optional[str] = None
    village: str
    tehsil: str
    district: str
    area: Optional[str] = None
    areaHectares: Optional[float] = None
    landUse: Optional[str] = "Agricultural"
    ownerName: str
    coordinates: Optional[List[float]] = None
    polygon: Optional[List[List[float]]] = None

class ValidationAnomaly(BaseModel):
    type: str
    severity: str
    field: Optional[str] = None
    confidence: float = 0.90
    explanation: str
    evidence: Optional[Dict[str, Any]] = None

class ValidationResult(BaseModel):
    isValid: bool
    anomaliesCount: int
    anomalies: List[ValidationAnomaly]
    notice: str = "AI-generated flag. Final verification must be performed by an authorized official."
    validationTimestamp: str

class RecordComparisonRequest(BaseModel):
    recordA: Dict[str, Any]
    recordB: Dict[str, Any]

class ComparisonDifference(BaseModel):
    field: str
    recordA: Any
    recordB: Any
    match: bool
    severity: str

class ComparisonResult(BaseModel):
    hasInconsistency: bool
    summary: str
    differences: List[ComparisonDifference]
    recommendation: str
    notice: str = "AI-generated flag. Final verification must be performed by an authorized official."

class DocumentOCRRequest(BaseModel):
    documentId: str
    filename: Optional[str] = None
    documentCategory: Optional[str] = "Sale Deed"
    rawText: Optional[str] = None

class ExtractedField(BaseModel):
    value: str
    confidence: float
    status: str

class DocumentOCRResult(BaseModel):
    documentId: str
    ocrEngine: str
    confidenceOverall: float
    extractedFields: Dict[str, ExtractedField]
    notice: str = "AI-generated flag. Final verification must be performed by an authorized official."
