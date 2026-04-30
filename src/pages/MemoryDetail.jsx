import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemories } from '../hooks/useMemories';
import { ArrowLeft, Trash2, Clock, Unlock, Lock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AudioPlayer from '../components/AudioPlayer';

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { memories, deleteMemory, getDecryptedMemory } = useMemories();
  
  const [memory, setMemory] = useState(null);
  const [decrypted, setDecrypted] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const found = memories.find((m) => m.id === id);
    if (!found) {
      navigate('/dashboard');
      return;
    }

    setMemory(found);

    // Self-destruct check
    if (found.timer) {
      if (Date.now() > found.timer) {
        setIsExpired(true);
        deleteMemory(id); // Actually delete it
        return;
      }
    }

    // Simulate decryption delay for effect
    const timer = setTimeout(() => {
      const dec = getDecryptedMemory(found);
      setDecrypted(dec);
      setIsDecrypting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, memories, navigate]);

  if (isExpired) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center border-red-500/50">
          <div className="p-4 bg-red-500/20 rounded-full inline-block mb-6">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Memory Destroyed</h2>
          <p className="text-slate-400 mb-6">
            The self-destruct timer for this memory has expired. The encrypted data has been permanently deleted from the vault.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Return to Vault
          </button>
        </div>
      </div>
    );
  }

  if (!memory) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 glass rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        
        <button 
          onClick={() => { deleteMemory(id); navigate('/dashboard'); toast.success('Memory deleted forever'); }}
          className="p-2 glass rounded-full hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card overflow-hidden"
      >
        {/* Header / Meta */}
        <div className="bg-slate-900/80 p-6 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium uppercase tracking-wider">
              {memory.category || 'Uncategorized'}
            </span>
            <span className="text-sm text-slate-400">
              {format(new Date(memory.date), 'MMMM d, yyyy - h:mm a')}
            </span>
          </div>

          {memory.timer && (
            <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
              <Clock className="w-4 h-4" />
              <span>Destructs in {Math.max(1, Math.round((memory.timer - Date.now()) / 60000))}m</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10 min-h-[400px] relative flex flex-col items-center justify-center">
          {isDecrypting ? (
            <div className="flex flex-col items-center text-indigo-400">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mb-4"
              >
                <Lock className="w-12 h-12" />
              </motion.div>
              <p className="font-medium animate-pulse">Decrypting AES-256...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="w-full h-full text-left"
            >
              <div className="flex items-center space-x-2 text-indigo-400 mb-6 border-b border-slate-800/50 pb-4 inline-flex">
                <Unlock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Decrypted Securely</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {decrypted?.title}
              </h1>

              {decrypted?.image && (
                <div className="mb-8 rounded-xl overflow-hidden border border-slate-700 bg-black/50">
                  <img src={decrypted.image} alt="Decrypted memory" className="max-w-full h-auto max-h-[60vh] object-contain mx-auto" />
                </div>
              )}

              {decrypted?.audioUrl && (
                <div className="mb-8">
                  <AudioPlayer src={decrypted.audioUrl} />
                </div>
              )}

              <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {decrypted?.content}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MemoryDetail;
