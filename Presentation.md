---
marp: true
theme: default
paginate: true
backgroundColor: #0A0A0A
color: #FFFFFF
style: |
  section {
    font-family: 'Inter', sans-serif;
  }
  h1 {
    color: #3B82F6;
  }
  h2 {
    color: #60A5FA;
  }
  code {
    background: #1E1E1E;
    color: #A78BFA;
  }
  footer {
    color: #4B5563;
  }
---

# AI-Based Multimodal Emotion & Behavior Analysis System
### A Comprehensive Approach to Human Affective Computing

**Presented by:** [Your Name]
**Project:** Full-Stack AI Implementation

---

## 🌟 Introduction
- **Multimodal AI**: Perceiving human emotions through multiple "senses".
- **Goal**: Combine Face, Voice, and Text inputs for a holistic behavioral report.
- **Impact**: Enhances accuracy by capturing context that single-modality systems miss.

---

## ❓ Problem Statement
- **Context Gap**: Text-only or face-only systems often miss sarcasm or hidden stress.
- **Subjectivity**: Human observation can be biased.
- **Need**: Objective, automated emotional analysis for mental health, HR, and customer service.

---

## 🎯 Project Objectives
1. **Detect** facial emotions using Computer Vision.
2. **Analyze** vocal tone and pitch using Signal Processing.
3. **Evaluate** text sentiment using NLP.
4. **Fuse** all data into a single behavioral insight using LLMs.

---

## 🏗️ System Architecture
- **Frontend**: React.js (Live Capture & Dashboard)
- **AI Engine**: Google Gemini (Multimodal Fusion)
- **Backend**: Node.js / Express (API Layer)
- **Database**: SQLite (Persistence)

---

## 📸 Module 1: Face Emotion Detection
- **Technology**: OpenCV + CNN / Gemini Vision.
- **Input**: Webcam snapshots.
- **Output**: Happy, Sad, Angry, Neutral, Surprise, Fear.
- **Logic**: Face detection -> Feature extraction -> Classification.

---

## 🎙️ Module 2: Voice Emotion Analysis
- **Technology**: MFCC Extraction + Gemini Audio.
- **Metrics**: Pitch, Tone, Intensity, and Jitter.
- **States**: Confidence, Stress, Nervousness, Calmness.
- **Logic**: Audio recording -> Feature extraction -> Emotional Mapping.

---

## ✍️ Module 3: Text Sentiment Analysis
- **Technology**: NLP (Transformers / Gemini).
- **Focus**: Sentiment (Positive/Negative) and Intent.
- **Role**: Provides the "what" behind the emotional "how".

---

## 🧠 Multimodal Fusion Logic
- **The Challenge**: How to combine conflicting signals?
- **The Solution**: Weighted Fusion + LLM Reasoning.
- **Result**: A "Behavioral Insight" that explains the user's state in plain English.

---

## 💻 Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: SQLite (better-sqlite3).
- **AI**: Google Gemini SDK (@google/genai).
- **Python**: OpenCV, TensorFlow, Librosa (Reference).

---

## 📊 Results & Dashboard
- **Live Feed**: Real-time webcam and mic capture.
- **History**: Historical trend tracking.
- **Reports**: Detailed modal view for each analysis.
- **UX**: Clean, "Technical Dashboard" aesthetic.

---

## 🚀 Future Scope
- **Real-time Streaming**: Continuous tracking via WebSockets.
- **Wearables**: Integrating heart rate and skin conductance.
- **VR/AR**: Driving virtual avatars with detected emotions.
- **Enterprise**: Integration into video conferencing tools.

---

## 🏁 Conclusion
- Multimodal AI is the future of human-computer interaction.
- Our system provides a scalable and accurate way to monitor emotional well-being.
- **Final Thought**: "Technology that understands not just what we say, but how we feel."

---

# Thank You!
### Any Questions?
