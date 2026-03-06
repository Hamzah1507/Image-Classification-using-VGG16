import json
import numpy as np
from PIL import Image
import tensorflow as tf
from backend.core.config import settings

class VGG16Predictor:
    def __init__(self):
        self.model = None
        self.class_names = None
        self.load_model()

    def load_model(self):
        print("🔄 Loading VGG16 model...")
        self.model = tf.keras.models.load_model(
            settings.MODEL_PATH,
            compile=False
        )
        self.model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        with open(settings.CLASS_NAMES_PATH, 'r') as f:
            self.class_names = json.load(f)
        print(f"✅ Model loaded! Classes: {self.class_names}")

    def preprocess(self, image: Image.Image) -> np.ndarray:
        img = image.convert("RGB").resize((224, 224))
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)

    def predict(self, image: Image.Image) -> dict:
        processed = self.preprocess(image)
        predictions = self.model.predict(processed)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])

        all_predictions = {
            self.class_names[i]: round(float(predictions[0][i]) * 100, 2)
            for i in range(len(self.class_names))
        }

        return {
            "predicted_class": self.class_names[predicted_idx],
            "confidence": round(confidence * 100, 2),
            "all_predictions": all_predictions
        }

predictor = VGG16Predictor()