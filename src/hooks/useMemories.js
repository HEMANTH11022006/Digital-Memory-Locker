import { useState, useEffect } from 'react';
import { encryptData, decryptData } from '../utils/encryption';
import { useAuth } from './AuthContext';

export const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    // Load from local storage for demo
    // In production: listen to Firestore collection 'memories' where uid === user.uid
    const stored = localStorage.getItem(`memories_${user.uid}`);
    if (stored) {
      const encryptedArray = JSON.parse(stored);
      // We don't decrypt immediately to show the "unlock" feature later
      // But for dashboard, we might need metadata. 
      // Usually, metadata is unencrypted, content is encrypted.
      setMemories(encryptedArray);
    }
  }, [user]);

  const saveMemories = (newMemories) => {
    setMemories(newMemories);
    if (user) {
      localStorage.setItem(`memories_${user.uid}`, JSON.stringify(newMemories));
    }
  };

  const addMemory = (memory) => {
    const memoryToSave = {
      id: Date.now().toString(),
      title: encryptData(memory.title),
      content: encryptData(memory.content),
      category: memory.category, // unencrypted for filtering
      date: new Date().toISOString(),
      timer: memory.timer || null,
      type: memory.type || 'text', // text, image, audio
      image: memory.image ? encryptData(memory.image) : null,
    };
    
    saveMemories([memoryToSave, ...memories]);
  };

  const deleteMemory = (id) => {
    saveMemories(memories.filter(m => m.id !== id));
  };

  // Helper to decrypt a single memory for viewing
  const getDecryptedMemory = (memory) => {
    return {
      ...memory,
      title: decryptData(memory.title) || 'Decryption Failed',
      content: decryptData(memory.content) || '',
      image: memory.image ? decryptData(memory.image) : null,
    };
  };

  return { memories, addMemory, deleteMemory, getDecryptedMemory };
};
