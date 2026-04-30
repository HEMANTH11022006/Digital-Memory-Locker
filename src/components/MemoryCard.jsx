import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Lock, Image as ImageIcon, Mic, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemories } from '../hooks/useMemories';
import AudioPlayer from './AudioPlayer';

const TypeIcon = ({ type }) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-4 h-4" />;
    case 'audio': return <Mic className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const MemoryCard = ({ memory }) => {
  const { getDecryptedMemory } = useMemories();
  
  // Decrypt just for display, in a real highly sensitive app, 
  // you might require a tap to decrypt even the title.
  const decrypted = useMemo(() => getDecryptedMemory(memory), [memory]);
  
  const isSelfDestructing = !!memory.timer;

  return (
    <Link to={`/memory/${memory.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass-card p-5 relative overflow-hidden group border border-slate-700/50 hover:border-indigo-500/50 transition-all"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <TypeIcon type={memory.type} />
            <span className="text-xs font-medium uppercase tracking-wider">{memory.category || 'Uncategorized'}</span>
          </div>
          {isSelfDestructing && (
            <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg" title="Self-destructing memory">
              <Clock className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {decrypted.title || 'Untitled Memory'}
        </h3>
        
        {decrypted.audioUrl ? (
          <div className="mb-4" onClick={(e) => e.preventDefault()}>
            <AudioPlayer src={decrypted.audioUrl} minimal={true} />
          </div>
        ) : (
          <p className="text-slate-400 text-sm line-clamp-2 mb-4">
            {/* We show a locked preview instead of actual content for security on dashboard */}
            Encrypted content. Tap to unlock and view.
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center">
            <Lock className="w-3 h-3 mr-1" /> AES-256
          </span>
          <span>{format(new Date(memory.date), 'MMM d, yyyy')}</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default MemoryCard;
