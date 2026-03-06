import os
import numpy as np
from PIL import Image

IMG_SIZE = (224, 224)
DATA_DIR = "data/raw"

def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    return img_array

def load_dataset():
    images, labels, class_names = [], [], []
    class_names = sorted([
        d for d in os.listdir(DATA_DIR) 
        if os.path.isdir(os.path.join(DATA_DIR, d))
    ])
    
    for label, class_name in enumerate(class_names):
        class_dir = os.path.join(DATA_DIR, class_name)
        for img_file in os.listdir(class_dir):
            img_path = os.path.join(class_dir, img_file)
            try:
                img = preprocess_image(img_path)
                images.append(img)
                labels.append(label)
            except Exception as e:
                print(f"Skipping {img_file}: {e}")
    
    return np.array(images), np.array(labels), class_names

if __name__ == "__main__":
    X, y, classes = load_dataset()
    print(f"✅ Loaded {len(X)} images")
    print(f"📦 Classes: {classes}")