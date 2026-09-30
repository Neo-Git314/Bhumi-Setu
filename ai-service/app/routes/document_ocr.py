from fastapi import APIRouter
from ..models.schemas import DocumentOCRRequest, DocumentOCRResult
from ..services.document_parser import parse_land_document_text

router = APIRouter(prefix="/ocr", tags=["Document OCR"])

@router.post("/process-document", response_model=DocumentOCRResult)
async def process_document(req: DocumentOCRRequest):
    text = req.rawText or (
        f"Registered Deed of Sale: Owner Shri Suresh Kumar Sharma, "
        f"Khasra No 142/1, Area 2.45 Hectares in Village Badshahpur, Tehsil Gurugram. "
        f"Registration No REG-2018-0912."
    )
    result = parse_land_document_text(text, req.documentId)
    return DocumentOCRResult(**result)
