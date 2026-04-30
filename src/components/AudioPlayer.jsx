import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioPlayer = ({ src, minimal = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    // Add listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent * 100);
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (minimal) {
    return (
      <div 
        className="flex items-center space-x-3 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 mt-2"
        onClick={(e) => e.preventDefault()}
      >
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          onClick={togglePlay}
          className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 rounded-full transition-colors flex-shrink-0"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden relative" onClick={handleSeek}>
          <div 
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-[10px] font-mono text-slate-400 flex-shrink-0 w-8 text-right">
          {formatTime(duration)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors shadow-lg shadow-indigo-500/20"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200">Audio Recording</span>
              <span className="text-xs text-slate-400 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
          
          <button 
            onClick={toggleMute}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
        
        <div 
          className="h-2 w-full bg-slate-800 rounded-full cursor-pointer relative group"
          onClick={handleSeek}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
