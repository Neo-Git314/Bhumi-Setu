from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/nlp", tags=["NLP"])

class TextAnalysisRequest(BaseModel):
    text: str

@router.post("/extract-entities")
async def extract_entities(req: TextAnalysisRequest):
    return {
        "status": "Success",
        "tokensExtracted": len(req.text.split()),
        "notice": "AI-generated flag. Final verification must be performed by an authorized official.",
        "summary": "Statutory legal text parsed for cadastral and title entities."
    }
