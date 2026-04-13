import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  faceEmotion: string;
  voiceEmotion: string;
  textSentiment: string;
  multimodalAnalysis: string;
  behavioralReport: string;
}

export async function analyzeMultimodal(
  imageBuffer: string | null, // base64
  audioBuffer: string | null, // base64
  textInput: string
): Promise<AnalysisResult> {
  const model = "gemini-flash-latest";

  const parts: any[] = [
    { text: `Analyze the following inputs to detect human emotions and behavior.
    
    Inputs:
    1. Image (Face): Detect facial expression and emotion.
    2. Audio (Voice): Analyze tone, pitch, and emotional state (Confidence, Stress, Nervousness, etc.).
    3. Text: Analyze sentiment and intent.
    
    User Text Input: "${textInput}"
    
    Please provide a structured JSON response with the following fields:
    - faceEmotion: The detected emotion from the face (e.g., Happy, Sad, Angry, Neutral).
    - voiceEmotion: The detected emotion from the voice (e.g., Confident, Stressed, Nervous, Calm).
    - textSentiment: The sentiment of the text (e.g., Positive, Negative, Neutral).
    - multimodalAnalysis: A combined summary of all three inputs.
    - behavioralReport: A detailed behavioral analysis and recommendations.
    ` }
  ];

  if (imageBuffer) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBuffer.split(',')[1] || imageBuffer
      }
    });
  }

  if (audioBuffer) {
    // Note: Gemini 1.5 Pro/Flash supports audio. 
    // We send it as base64.
    parts.push({
      inlineData: {
        mimeType: "audio/webm", // Common for MediaRecorder
        data: audioBuffer.split(',')[1] || audioBuffer
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      faceEmotion: result.faceEmotion || "Unknown",
      voiceEmotion: result.voiceEmotion || "Unknown",
      textSentiment: result.textSentiment || "Unknown",
      multimodalAnalysis: result.multimodalAnalysis || "No analysis generated.",
      behavioralReport: result.behavioralReport || "No report generated."
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze multimodal data.");
  }
}
