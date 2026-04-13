# AI-Based Multimodal Emotion & Behavior Analysis System

## 🚀 Project Overview
This project is a full-stack application that analyzes human emotions using three modalities:
1. **Face**: Captured via webcam.
2. **Voice**: Recorded via microphone.
3. **Text**: User-provided sentiment input.

The system uses **Multimodal Fusion** to combine these inputs and generate a comprehensive behavioral report using the Gemini AI model.

---

## 📂 Folder Structure
- `/src`: React Frontend
  - `/components`: UI components (Webcam, Audio, Dashboard)
  - `/lib`: Utility functions and AI service integration
- `/server.ts`: Express Backend (API & Database)
- `/ai_models.py`: Reference Python code for traditional ML implementation (CNN, MFCC)
- `/emotions.db`: SQLite database for storing analysis history

---

## 🧠 AI Implementation Details

### 1. Face Emotion Detection
- **Live App**: Uses Gemini Pro Vision to analyze facial expressions directly from webcam snapshots.
- **Python Reference**: Implements a CNN model (trained on FER2013) using OpenCV for real-time detection.

### 2. Voice Emotion Analysis
- **Live App**: Uses Gemini's native audio processing to detect tone, pitch, and emotional state from recorded audio.
- **Python Reference**: Uses `librosa` to extract MFCC (Mel-frequency cepstral coefficients) for classification.

### 3. Text Sentiment Analysis
- **Live App**: Uses Gemini NLP to analyze sentiment and intent.
- **Traditional**: Can be implemented using Transformers (BERT) or TF-IDF with Naive Bayes.

---

## 📊 Dataset Suggestions for Training
If you want to train your own models (as in `ai_models.py`):
1. **Face**: [FER2013](https://www.kaggle.com/datasets/msambare/fer2013) or [CK+](http://www.jeffcohn.net/Resources/).
2. **Voice**: [RAVDESS](https://zenodo.org/record/1188976) or [TESS](https://www.kaggle.com/datasets/ejlok1/toronto-emotional-speech-set-tess).
3. **Text**: [GoEmotions](https://github.com/google-research/google-research/tree/master/goemotions) or [SST-5](https://nlp.stanford.edu/sentiment/treebank.html).

---

## 🔧 How to Connect Everything
1. **Frontend to Backend**: The React app calls `/api/reports` to save and fetch analysis history.
2. **Frontend to AI**: The React app uses the `@google/genai` SDK to send multimodal data (image + audio + text) to Gemini.
3. **Backend to DB**: Express uses `better-sqlite3` to persist data in a local SQLite file.

---

## 🚢 Deployment Steps
1. **Environment Variables**: Add `GEMINI_API_KEY` to your hosting provider's secrets.
2. **Build**: Run `npm run build` to generate the static frontend assets.
3. **Start**: Run `npm start` to launch the Express server, which serves both the API and the static frontend.
4. **Cloud Run / Heroku**: This project is ready for containerized deployment (e.g., Docker).

---

## 💡 Advanced Suggestions
1. **Real-time Streaming**: Use WebSockets (Socket.io) for continuous emotion tracking.
2. **Stress Level Correlation**: Integrate heart rate data from wearable APIs (Fitbit/Apple Health).
3. **Personalized Baseline**: Train the model to understand a specific user's "neutral" state to improve accuracy.
4. **3D Avatar Feedback**: Use the detected emotions to drive a 3D avatar (Three.js) in real-time.
