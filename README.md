# 🌸 VisionAI — Image Classification using VGG16

> VGG16 Transfer Learning — 7-class image classifier (flowers + gender detection) with FastAPI backend & React UI. **86% accuracy** trained on T4 GPU

---

## 🤖 AI Model

| Category | Details |
|----------|---------|
| **Architecture** | VGG16 (Transfer Learning from ImageNet) |
| **Framework** | TensorFlow / Keras |
| **Training** | Google Colab T4 GPU |
| **Epochs** | 20 (EarlyStopping + ReduceLROnPlateau) |
| **Accuracy** | **86.27%** validation accuracy |
| **Dataset** | 6,300+ images across 7 classes |

---

## 🎯 Classes

| Class | Type | Count |
|-------|------|-------|
| 🌼 Daisy | Flower | ~764 |
| 🌱 Dandelion | Flower | ~1052 |
| 🌹 Rose | Flower | ~784 |
| 🌻 Sunflower | Flower | ~733 |
| 🌷 Tulip | Flower | ~984 |
| 👨 Male | Gender | ~1000 |
| 👩 Female | Gender | ~1000 |

---

## ✨ Features

- 📸 **Real-time image classification** — upload any image and get instant predictions
- 📊 **Confidence scores** — probability breakdown for all 7 classes
- 🎨 **Modern React UI** — dark navy theme with animated progress bars
- ⚡ **FastAPI backend** — high-performance REST API with image validation
- 🧠 **Transfer Learning** — VGG16 pretrained on ImageNet, fine-tuned for custom classes
- 🔄 **Data Augmentation** — rotation, zoom, flip for better generalization
- 🖱️ **Drag & Drop** — drag and drop image upload support

---

## 🛠️ Tech Stack

**ML & Backend**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![Keras](https://img.shields.io/badge/Keras-D00000?style=flat&logo=keras&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)

**Frontend**

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 📁 Project Structure

```
vgg16-classifier/
├── backend/
│   ├── api/
│   │   └── routes.py          # FastAPI endpoints
│   ├── core/
│   │   └── config.py          # App configuration
│   ├── ml/
│   │   ├── inference/
│   │   │   └── predictor.py   # Model inference
│   │   ├── model/
│   │   │   └── vgg16_model.py # Model architecture
│   │   └── preprocessing/
│   │       └── preprocess.py  # Image preprocessing
│   └── main.py                # FastAPI app entry point
├── frontend/
│   └── src/
│       └── App.jsx            # React frontend
├── models/
│   └── saved/                 # Trained model files (not tracked)
├── data/
│   └── raw/                   # Dataset (not tracked)
├── logs/                      # Training plots
├── notebooks/                 # Jupyter notebooks
└── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- TensorFlow 2.17+

### 1. Clone the repository
```bash
git clone https://github.com/Hamzah1507/Image-Classification-using-VGG16.git
cd Image-Classification-using-VGG16
```

### 2. Setup Backend
```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 3. Add Model Files
Download trained model and place in `models/saved/`:
- `vgg16_final.keras`
- `class_names.json`

### 4. Run Backend
```bash
python -m backend.main
# API running at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### 5. Run Frontend
```bash
cd frontend
npm install
npm run dev
# UI running at http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | Health check |
| `POST` | `/api/predict` | Upload image → get prediction |

### Example Request
```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "accept: application/json" \
  -F "file=@sunflower.jpg"
```

### Example Response
```json
{
  "predicted_class": "sunflower",
  "confidence": 99.2,
  "all_predictions": {
    "daisy": 0.12,
    "dandelion": 0.28,
    "rose": 0.0,
    "sunflower": 99.2,
    "tulip": 0.4,
    "male": 0.0,
    "female": 0.0
  }
}
```

---

## 🧪 Model Training

Training was done on **Google Colab T4 GPU** using `ImageDataGenerator` for memory-efficient batch loading.

```
Train/Val Split : 80% / 20%
Batch Size      : 32
Image Size      : 224 × 224
Optimizer       : Adam (lr=0.0001)
Loss            : Sparse Categorical Crossentropy
Callbacks       : ModelCheckpoint, EarlyStopping (patience=5), ReduceLROnPlateau
```

**Training Results:**
```
Best Epoch      : 18/20
Val Accuracy    : 86.27%
Train Accuracy  : 92.20%
```

---

## 👨‍💻 Author

**Mohammed Hamzah Saiyed**
- GitHub: [@Hamzah1507](https://github.com/Hamzah1507)
- Email: hamzah.2004saiyed@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

> 🎓 GLS University Capstone Project 2025–26
