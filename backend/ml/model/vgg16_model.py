import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam

NUM_CLASSES = 7  # Cat, Dog, Daisy, Tulip, Sunflower, Rose, Dandelion

def build_vgg16_model():
    # Load VGG16 pretrained on ImageNet (Transfer Learning)
    base_model = VGG16(
        weights="imagenet",
        include_top=False,        # Remove final classification layer
        input_shape=(224, 224, 3)
    )

    # Freeze base layers (don't retrain them)
    for layer in base_model.layers:
        layer.trainable = False

    # Add custom classification head
    x = base_model.output
    x = Flatten()(x)
    x = Dense(512, activation="relu")(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.3)(x)
    output = Dense(NUM_CLASSES, activation="softmax")(x)

    model = Model(inputs=base_model.input, outputs=output)

    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model

if __name__ == "__main__":
    model = build_vgg16_model()
    model.summary()