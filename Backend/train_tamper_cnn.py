import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

def build_and_train_tampering_cnn():
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, "tampering_model.h5")

    print("[CNN] Building lightweight ELA Tampering Detection CNN model...")

    model = models.Sequential([
        layers.Input(shape=(128, 128, 3)),
        layers.Conv2D(16, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')
    ])

    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    # Generate synthetic training samples (Authentic = low variance, Tampered = high variance ELA blobs)
    np.random.seed(42)
    num_samples = 100
    X = np.random.uniform(0.0, 0.2, (num_samples, 128, 128, 3)).astype(np.float32)
    y = np.zeros((num_samples, 1), dtype=np.float32)

    # Half tampered with bright spots
    for i in range(num_samples // 2, num_samples):
        y[i] = 1.0
        # Add high variance thermal blob
        rx = np.random.randint(20, 80)
        ry = np.random.randint(20, 80)
        X[i, rx:rx+30, ry:ry+30, 0] = 0.9 # Red channel high variance
        X[i, rx:rx+30, ry:ry+30, 1] = 0.1

    print("[CNN] Training lightweight CNN model for 3 epochs...")
    model.fit(X, y, epochs=3, batch_size=16, verbose=1)

    model.save(model_path)
    print(f"[CNN] Successfully saved tampering CNN model at {model_path}")

if __name__ == "__main__":
    build_and_train_tampering_cnn()
