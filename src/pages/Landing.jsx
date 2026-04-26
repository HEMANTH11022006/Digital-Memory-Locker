import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Zap, FileJson } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 flex flex-col items-start"
  >
    <div className="p-3 bg-indigo-500/20 rounded-2xl mb-4">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide mb-6 inline-block">
              Military-Grade Encryption
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8"
          >
            Your Memories, <br/>
            <span className="text-gradient">Securely Locked.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Digital Memory Locker ensures your personal notes, images, and audio are encrypted before they ever leave your device. Only you hold the key.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Open Your Vault
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 glass text-white rounded-full font-semibold hover:bg-slate-800/50 transition-colors">
              Learn More
            </a>
          </motion.div>
        </div>

        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Shield} 
            title="End-to-End Encryption" 
            description="Your memories are encrypted with AES-256 before storing. We never see your raw data."
            delay={0.4}
          />
          <FeatureCard 
            icon={Lock} 
            title="PIN Protected" 
            description="Access your vault quickly and securely with a personalized 4-digit PIN lock screen."
            delay={0.5}
          />
          <FeatureCard 
            icon={Zap} 
            title="Self-Destruct Timer" 
            description="Set a timer on sensitive memories to automatically delete them after a certain period."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
