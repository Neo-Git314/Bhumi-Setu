from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import validation, comparison, document_ocr, nlp

app = FastAPI(
    title="BHUMI SETU 360° AI/ML Decision Support Microservice",
    description="SIH PS 26019: Land Governance Anomaly Detection, OCR & Conflict Resolution Engine",
    version="1.0.0"
)

# Enable CORS for React frontend and Express backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(validation.router, prefix="/api/ai")
app.include_router(comparison.router, prefix="/api/ai")
app.include_router(document_ocr.router, prefix="/api/ai")
app.include_router(nlp.router, prefix="/api/ai")

@app.get("/")
def root():
    return {
        "service": "Bhumi Setu 360 AI Engine",
        "status": "RUNNING",
        "notice": "AI-generated flag. Final verification must be performed by an authorized official.",
        "algorithms": [
            "Levenshtein & Soundex Phonetic Duplicate Matching",
            "Cadastral Spatial Bounding-Box Overlap Intersection",
            "Geodesic Shoelace Parcel Area Deviation Verification",
            "Document PyMuPDF & Tesseract Statutory Entity Parsing"
        ]
    }

@app.get("/health")
def health():
    return {"status": "HEALTHY", "service": "bhumi-ai-microservice"}
