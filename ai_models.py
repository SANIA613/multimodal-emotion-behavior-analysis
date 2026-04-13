import cv2
import numpy as np
import librosa
import tensorflow as tf
from tensorflow.keras.models import load_model

# --- 1. Face Emotion Detection (OpenCV + CNN) ---

class FaceEmotionDetector:
    def __init__(self, model_path='emotion_model.h5'):
        # Load pre-trained CNN model (you would train this on FER2013 dataset)
        # For this example, we assume model_path exists.
        try:
            self.model = load_model(model_path)
            self.emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
        except:
            print("Model not found. Please train the model first.")
            self.model = None
        
        # Load OpenCV Face Cascade
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def detect_emotion(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        results = []
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48))
            roi_gray = roi_gray.astype('float') / 255.0
            roi_gray = np.expand_dims(roi_gray, axis=0)
            roi_gray = np.expand_dims(roi_gray, axis=-1)
            
            if self.model:
                prediction = self.model.predict(roi_gray)
                max_index = int(np.argmax(prediction))
                emotion = self.emotions[max_index]
            else:
                emotion = "Model Not Loaded"
                
            results.append({
                'box': (x, y, w, h),
                'emotion': emotion
            })
        return results

# --- 2. Voice Emotion Analysis (MFCC) ---

def extract_voice_features(file_path):
    # Load audio file
    X, sample_rate = librosa.load(file_path, res_type='kaiser_fast')
    # Extract MFCC features
    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
    return mfccs

# --- 3. Multimodal Fusion Example ---

def multimodal_fusion(face_score, voice_score, text_score):
    # Simple weighted fusion
    # weights: Face (0.4), Voice (0.3), Text (0.3)
    final_score = (face_score * 0.4) + (voice_score * 0.3) + (text_score * 0.3)
    return final_score

# --- 4. Main Webcam Loop ---

def run_webcam_demo():
    detector = FaceEmotionDetector()
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        emotions = detector.detect_emotion(frame)
        
        for res in emotions:
            x, y, w, h = res['box']
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, res['emotion'], (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)
            
        cv2.imshow('Emotion Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    print("This script provides the Python logic for emotion detection.")
    print("To run the webcam demo, ensure you have opencv-python and tensorflow installed.")
    # run_webcam_demo()
