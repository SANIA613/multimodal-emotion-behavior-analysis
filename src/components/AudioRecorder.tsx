import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBase64: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-white/50">Voice Input</h3>
        {isRecording && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2 text-red-500 text-[10px] font-mono"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            RECORDING
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!audioUrl ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all ${
              isRecording 
                ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} />}
            <span className="text-sm font-medium">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
        ) : (
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-10 bg-black/40 rounded flex items-center px-3 border border-white/5">
              <audio src={audioUrl} controls className="h-8 w-full" />
            </div>
            <button
              onClick={deleteRecording}
              className="p-2 text-white/40 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
