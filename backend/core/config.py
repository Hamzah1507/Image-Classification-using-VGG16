import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    APP_NAME: str = "VGG16 Image Classifier"
    VERSION: str = "1.0.0"
    MODEL_PATH: str = str(BASE_DIR / "models" / "saved" / "vgg16_final.keras")
    CLASS_NAMES_PATH: str = str(BASE_DIR / "models" / "saved" / "class_names.json")
    MAX_IMAGE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: list = ["jpg", "jpeg", "png", "webp"]

settings = Settings()