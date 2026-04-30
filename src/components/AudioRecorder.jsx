import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, RotateCcw, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AudioRecorder = ({ onRecordingComplete, onClear }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 300) { // Max 5 minutes (300 seconds)
            stopRecording();
            toast.error('Maximum recording duration reached (5 minutes)');
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone permission denied');
      } else {
        toast.error('Could not access microphone');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
    clearRecording();
  };

  const clearRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    onClear();
  };

  const togglePlay = () => {
    if (!audioPlayerRef.current) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-colors">
      {!audioBlob ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="text-xl font-mono text-slate-300">
            {formatTime(recordingTime)}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center"
              >
                <Mic className="w-6 h-6" />
              </button>
            ) : (
              <>
                <motion.button
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={stopRecording}
                  className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors flex items-center justify-center"
                >
                  <Square className="w-6 h-6 fill-current" />
                </motion.button>
                <button
                  onClick={cancelRecording}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-colors"
                  title="Cancel"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          {isRecording && (
            <div className="flex items-center space-x-2 text-red-400 text-sm font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Recording...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <audio 
            ref={audioPlayerRef} 
            src={audioUrl} 
            onEnded={() => setIsPlaying(false)}
            className="hidden" 
          />
          
          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <button
              onClick={togglePlay}
              className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 mx-4">
               {/* Simple waveform representation */}
               <div className="h-8 w-full flex items-center space-x-1 justify-center opacity-70">
                 {[...Array(20)].map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ height: 4 }}
                     animate={{ height: isPlaying ? Math.random() * 24 + 4 : 4 }}
                     transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.2 }}
                     className="w-1.5 bg-indigo-400 rounded-full"
                   />
                 ))}
               </div>
            </div>
            
            <span className="text-sm font-mono text-slate-400 mr-4">
              {formatTime(recordingTime)}
            </span>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <button
              onClick={clearRecording}
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Discard</span>
            </button>
            <button
              onClick={clearRecording}
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Re-record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
