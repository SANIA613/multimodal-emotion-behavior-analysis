import React, { useState, useEffect } from 'react';
import { WebcamCapture } from './WebcamCapture';
import { AudioRecorder } from './AudioRecorder';
import { analyzeMultimodal, AnalysisResult } from '../lib/gemini';
import { Brain, Send, History, Loader2, AlertCircle, CheckCircle2, User, X, Maximize2, MessageSquare, Mic, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AnalysisDashboard: React.FC = () => {
  type InputStatus = 'idle' | 'analyzing' | 'success' | 'error';
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const [faceStatus, setFaceStatus] = useState<InputStatus>('idle');
  const [voiceStatus, setVoiceStatus] = useState<InputStatus>('idle');
  const [textStatus, setTextStatus] = useState<InputStatus>('idle');

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
    setFaceStatus(capturedImage ? 'analyzing' : 'idle');
    setVoiceStatus(recordedAudio ? 'analyzing' : 'idle');
    setTextStatus(textInput ? 'analyzing' : 'idle');

    try {
      const analysis = await analyzeMultimodal(capturedImage, recordedAudio, textInput);
      setResult(analysis);
      setHasSaved(false);

      setFaceStatus(capturedImage ? 'success' : 'idle');
      setVoiceStatus(recordedAudio ? 'success' : 'idle');
      setTextStatus(textInput ? 'success' : 'idle');
    } catch (err) {
      setFaceStatus(capturedImage ? 'error' : 'idle');
      setVoiceStatus(recordedAudio ? 'error' : 'idle');
      setTextStatus(textInput ? 'error' : 'idle');
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveReport = async () => {
    if (!result || isSaving || hasSaved) return;

    setIsSaving(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          face_emotion: result.faceEmotion,
          voice_emotion: result.voiceEmotion,
          text_sentiment: result.textSentiment,
          multimodal_analysis: result.multimodalAnalysis,
          behavioral_report: result.behavioralReport,
          user_id: 'current-user'
        })
      });
      setHasSaved(true);
      fetchHistory();
    } catch (err) {
      console.error("Failed to save report:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const StatusBadge = ({ status }: { status: 'idle' | 'analyzing' | 'success' | 'error' }) => {
    if (status === 'idle') return null;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10"
      >
        {status === 'analyzing' && <Loader2 size={12} className="animate-spin text-blue-400" />}
        {status === 'success' && <CheckCircle2 size={12} className="text-emerald-400" />}
        {status === 'error' && <AlertCircle size={12} className="text-red-400" />}
        <span className={`text-[10px] font-mono uppercase tracking-wider ${
          status === 'analyzing' ? 'text-blue-400' : 
          status === 'success' ? 'text-emerald-400' : 
          'text-red-400'
        }`}>
          {status}
        </span>
      </motion.div>
    );
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Visual Input</h2>
                  </div>
                  <StatusBadge status={faceStatus} />
                </div>
                <WebcamCapture onCapture={setCapturedImage} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-purple-500 rounded-full" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Audio Input</h2>
                    </div>
                    <StatusBadge status={voiceStatus} />
                  </div>
                  <AudioRecorder onRecordingComplete={setRecordedAudio} />
                </section>

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Text Input</h2>
                    </div>
                    <StatusBadge status={textStatus} />
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

                      <button
                        onClick={saveReport}
                        disabled={isSaving || hasSaved}
                        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                          hasSaved 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {isSaving ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : hasSaved ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <History size={18} />
                        )}
                        {isSaving ? 'Saving...' : hasSaved ? 'Saved to History' : 'Save to History'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Analysis History</h2>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">{history.length} Reports Saved</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((report) => (
                <motion.div 
                  key={report.id} 
                  layoutId={`report-${report.id}`}
                  onClick={() => setSelectedReport(report)}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500/50 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-white/30">{new Date(report.timestamp).toLocaleString()}</span>
                    <Maximize2 size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-400 uppercase font-medium">
                      <Camera size={10} /> {report.face_emotion}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] text-purple-400 uppercase font-medium">
                      <Mic size={10} /> {report.voice_emotion}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 uppercase font-medium">
                      <MessageSquare size={10} /> {report.text_sentiment}
                    </div>
                  </div>

                  <p className="text-sm line-clamp-2 text-white/70 mb-4 italic">"{report.behavioral_report}"</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <User size={12} />
                      {report.user_id}
                    </div>
                    <span className="text-[10px] text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Full Report →</span>
                  </div>
                </motion.div>
              ))}
              {history.length === 0 && (
                <div className="col-span-full py-20 text-center text-white/20 border border-dashed border-white/10 rounded-2xl">
                  <History size={48} className="mx-auto mb-4 opacity-10" />
                  <p>No reports found in history. Start an analysis to see results here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Full Report Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`report-${selectedReport.id}`}
              className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-bottom border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-lg font-bold">Analysis Report Details</h3>
                  <p className="text-xs text-white/40 font-mono">{new Date(selectedReport.timestamp).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Camera size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Face</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedReport.face_emotion}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Mic size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Voice</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedReport.voice_emotion}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <MessageSquare size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Text</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedReport.text_sentiment}</p>
                  </div>
                </div>

                <section>
                  <h4 className="text-xs font-mono uppercase text-white/30 mb-3 tracking-widest">Multimodal Fusion Summary</h4>
                  <div className="p-5 bg-white/5 rounded-xl border border-white/5 text-white/80 leading-relaxed">
                    {selectedReport.multimodal_analysis}
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-mono uppercase text-blue-400 mb-3 tracking-widest">Behavioral Insights & Report</h4>
                  <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-xl text-white leading-relaxed italic text-lg">
                    "{selectedReport.behavioral_report}"
                  </div>
                </section>

                <div className="pt-4 flex items-center gap-2 text-[10px] text-white/20 font-mono">
                  <User size={12} />
                  USER_ID: {selectedReport.user_id} • REPORT_ID: {selectedReport.id}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
