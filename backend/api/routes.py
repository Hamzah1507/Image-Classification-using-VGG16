from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io
from backend.ml.inference.predictor import predictor
from backend.core.config import settings

router = APIRouter()

@router.get("/")
def health_check():
    return {
        "status": "✅ running",
        "app": settings.APP_NAME,
        "version": settings.VERSION
    }

@router.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    # Validate file extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {settings.ALLOWED_EXTENSIONS}"
        )

    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")

    # Predict
    try:
        image = Image.open(io.BytesIO(contents))
        result = predictor.predict(image)
        return {
            "status": "success",
            "filename": file.filename,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))