import { useState, useEffect } from 'react';
import { encryptData, decryptData } from '../utils/encryption';
import { useAuth } from './AuthContext';
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection } from 'firebase/firestore';

export const useMemories = () => {
  const { user } = useAuth();

  const [memories, setMemories] = useState(() => {
    if (user) {
      const stored = localStorage.getItem(`memories_${user.uid}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (!user) {
      setMemories([]);
      return;
    }
    const stored = localStorage.getItem(`memories_${user.uid}`);
    if (stored) {
      const encryptedArray = JSON.parse(stored);
      setMemories(encryptedArray);
    }
  }, [user]);

  const saveMemories = (newMemories) => {
    setMemories(newMemories);
    if (user) {
      localStorage.setItem(`memories_${user.uid}`, JSON.stringify(newMemories));
    }
  };

  const addMemory = async (memory) => {
    let audioUrl = null;

    if (memory.audioBlob) {
      if (storage) {
        try {
          const fileRef = ref(storage, `audio/${user.uid}/${Date.now()}.webm`);
          const snapshot = await uploadBytes(fileRef, memory.audioBlob);
          audioUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.warn("Firebase Storage error, falling back to base64:", error);
          // Fallback if user hasn't configured Firebase properly
          const reader = new FileReader();
          audioUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(memory.audioBlob);
          });
        }
      } else {
        // Fallback for demo when Firebase config is missing
        const reader = new FileReader();
        audioUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(memory.audioBlob);
        });
      }
    }

    const memoryToSave = {
      id: Date.now().toString(),
      title: encryptData(memory.title),
      content: memory.content ? encryptData(memory.content) : null,
      category: memory.category, // unencrypted for filtering
      date: new Date().toISOString(),
      timer: memory.timer || null,
      type: memory.type || 'text', // text, image, audio
      image: memory.image ? encryptData(memory.image) : null,
      audioUrl: audioUrl ? encryptData(audioUrl) : null,
    };
    
    // Store in Firestore if available
    if (db && user) {
      try {
         await setDoc(doc(db, 'memories', memoryToSave.id), {
           ...memoryToSave,
           uid: user.uid
         });
      } catch (err) {
         console.warn("Firestore error (likely missing config):", err);
      }
    }

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
      content: memory.content ? decryptData(memory.content) : '',
      image: memory.image ? decryptData(memory.image) : null,
      audioUrl: memory.audioUrl ? decryptData(memory.audioUrl) : null,
    };
  };

  return { memories, addMemory, deleteMemory, getDecryptedMemory };
};
