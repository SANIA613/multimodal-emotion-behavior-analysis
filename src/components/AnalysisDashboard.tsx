import React, { useState, useEffect } from 'react';
import { WebcamCapture } from './WebcamCapture';
import { AudioRecorder } from './AudioRecorder';
import { analyzeMultimodal, AnalysisResult } from '../lib/gemini';
import { Brain, Send, History, Loader2, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AnalysisDashboard: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage && !recordedAudio && !textInput) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMultimodal(capturedImage, recordedAudio, textInput);
      setResult(analysis);

      // Save to DB
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          face_emotion: analysis.faceEmotion,
          voice_emotion: analysis.voiceEmotion,
          text_sentiment: analysis.textSentiment,
          multimodal_analysis: analysis.multimodalAnalysis,
          behavioral_report: analysis.behavioralReport,
          user_id: 'current-user'
        })
      });

      fetchHistory();
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="text-blue-500" />
            Emotion & Behavior AI
          </h1>
          <p className="text-white/40 text-xs font-mono mt-1 uppercase tracking-widest">Multimodal Analysis System v1.0</p>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-sm"
        >
          <History size={16} />
          {showHistory ? 'Back to Analysis' : 'View History'}
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {!showHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-7 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Visual Input</h2>
                </div>
                <WebcamCapture onCapture={setCapturedImage} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-purple-500 rounded-full" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Audio Input</h2>
                  </div>
                  <AudioRecorder onRecordingComplete={setRecordedAudio} />
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Text Input</h2>
                  </div>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Describe how you're feeling or what you're thinking..."
                    className="w-full h-[108px] bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </section>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!capturedImage && !recordedAudio && !textInput)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/20 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Analyzing Multimodal Data...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Generate Behavioral Report
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">AI Analysis Report</h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col">
                  {!result ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Brain size={32} className="text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">Provide inputs and click analyze to generate your behavioral report.</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase mb-1">Face</p>
                          <p className="text-sm font-medium text-blue-400">{result.faceEmotion}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase mb-1">Voice</p>
                          <p className="text-sm font-medium text-purple-400">{result.voiceEmotion}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase mb-1">Text</p>
                          <p className="text-sm font-medium text-emerald-400">{result.textSentiment}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono uppercase text-white/30 mb-2">Multimodal Fusion</h4>
                        <p className="text-sm leading-relaxed text-white/80">{result.multimodalAnalysis}</p>
                      </div>

                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h4 className="text-xs font-mono uppercase text-blue-400 mb-2">Behavioral Insights</h4>
                        <p className="text-sm leading-relaxed text-white/90 italic">"{result.behavioralReport}"</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Recent Analysis History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((report) => (
                <div key={report.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-white/30">{new Date(report.timestamp).toLocaleString()}</span>
                    <div className="flex gap-1">
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] rounded uppercase">{report.face_emotion}</span>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3 text-white/70 mb-4 italic">"{report.behavioral_report}"</p>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <User size={12} />
                    {report.user_id}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="col-span-full py-20 text-center text-white/20">
                  No reports found in history.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
