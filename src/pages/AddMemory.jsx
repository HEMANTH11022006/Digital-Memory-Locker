import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemories } from '../hooks/useMemories';
import { ArrowLeft, Image as ImageIcon, Mic, FileText, Clock, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import AudioRecorder from '../components/AudioRecorder';

const AddMemory = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [type, setType] = useState('text');
  const [timer, setTimer] = useState('');
  const [image, setImage] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { addMemory } = useMemories();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title || (!content && !image && !audioBlob)) {
      toast.error('Title and some content (text/image/audio) are required');
      return;
    }

    setIsUploading(true);
    
    // Basic timer validation (minutes)
    const expiration = timer ? Date.now() + parseInt(timer) * 60000 : null;

    try {
      await addMemory({
        title,
        content,
        category,
        type,
        timer: expiration,
        image,
        audioBlob
      });

      toast.success('Memory encrypted & saved');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 glass rounded-full mr-4 hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-white">New Encrypted Memory</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 space-y-6"
      >
        <div>
          <input
            type="text"
            placeholder="Memory Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none text-2xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-0 px-0"
          />
        </div>

        <div className="flex space-x-4 border-y border-slate-800 py-4">
          <button 
            onClick={() => setType('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'text' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4" /> <span>Text</span>
          </button>
          <button 
            onClick={() => { setType('image'); fileInputRef.current?.click(); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'image' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <ImageIcon className="w-4 h-4" /> <span>Image</span>
          </button>
          <button 
            onClick={() => setType('audio')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'audio' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Mic className="w-4 h-4" /> <span>Audio</span>
          </button>
        </div>

        {type === 'audio' && (
          <AudioRecorder 
            onRecordingComplete={(blob) => setAudioBlob(blob)} 
            onClear={() => setAudioBlob(null)} 
          />
        )}

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        {image && (
          <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-700">
            <img src={image} alt="Upload preview" className="w-full max-h-96 object-contain bg-slate-900" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              &times;
            </button>
          </div>
        )}

        <textarea
          placeholder="What do you want to keep secure?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="secret">Secret</option>
              <option value="ideas">Ideas</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Self-Destruct Timer (Optional)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                placeholder="Minutes..."
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Lock className="w-4 h-4" />
            <span>{isUploading ? 'Encrypting & Saving...' : 'Encrypt & Save'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMemory;
