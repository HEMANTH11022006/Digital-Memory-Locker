import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemories } from '../hooks/useMemories';
import MemoryCard from '../components/MemoryCard';
import { Search, Plus, Filter, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { memories } = useMemories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredMemories = memories.filter((m) => {
    // Note: Search relies on decrypted title in a real app, 
    // or tags/categories if title is strictly encrypted.
    // Here we filter by category since it's unencrypted, 
    // or we'd have to decrypt all to search (performance intensive but needed for local E2EE)
    const matchesCategory = filter === 'all' || m.category === filter;
    return matchesCategory;
  });

  const categories = ['all', 'personal', 'work', 'secret', 'ideas'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Vault</h1>
          <p className="text-slate-400">Securely storing {memories.length} memories.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative glass rounded-xl flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tags..."
              className="w-full bg-transparent border-none text-white pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'glass text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <MemoryCard memory={memory} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 bg-slate-800/30 rounded-full mb-6">
            <Database className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Vault is empty</h3>
          <p className="text-slate-400 max-w-sm">
            Your secure locker is ready. Add your first encrypted memory to get started.
          </p>
        </div>
      )}

      {/* FAB */}
      <Link
        to="/add"
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 hover:scale-110 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default Dashboard;
