import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { Lock, Delete } from 'lucide-react';
import { checkPin, setPin } from '../utils/encryption';
import toast from 'react-hot-toast';

const LockScreen = () => {
  const [pin, setPinState] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1: enter/setup, 2: confirm setup
  const { unlock } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if pin exists
    const hasPin = localStorage.getItem('locker_pin');
    if (!hasPin) {
      setIsSetupMode(true);
    }
  }, []);

  const handleInput = (digit) => {
    if (pin.length < 4 && step === 1) {
      const newPin = pin + digit;
      setPinState(newPin);
      if (newPin.length === 4) {
        processPin(newPin);
      }
    } else if (confirmPin.length < 4 && step === 2) {
      const newConfirmPin = confirmPin + digit;
      setConfirmPin(newConfirmPin);
      if (newConfirmPin.length === 4) {
        processConfirm(newConfirmPin);
      }
    }
  };

  const processPin = (currentPin) => {
    if (isSetupMode) {
      setTimeout(() => setStep(2), 300);
    } else {
      if (checkPin(currentPin)) {
        unlock();
        navigate('/dashboard');
      } else {
        toast.error('Incorrect PIN');
        setPinState('');
      }
    }
  };

  const processConfirm = (currentConfirmPin) => {
    if (currentConfirmPin === pin) {
      setPin(pin);
      toast.success('PIN Set Successfully');
      unlock();
      navigate('/dashboard');
    } else {
      toast.error('PINs do not match');
      setPinState('');
      setConfirmPin('');
      setStep(1);
    }
  };

  const handleDelete = () => {
    if (step === 1) setPinState(pin.slice(0, -1));
    else setConfirmPin(confirmPin.slice(0, -1));
  };

  const renderDots = () => {
    const activeLength = step === 1 ? pin.length : confirmPin.length;
    return (
      <div className="flex space-x-4 mb-8 justify-center">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: i < activeLength ? 1.2 : 1,
              backgroundColor: i < activeLength ? '#818cf8' : '#334155'
            }}
            className="w-4 h-4 rounded-full"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-sm flex flex-col items-center"
      >
        <div className="p-4 bg-indigo-500/20 rounded-full mb-6">
          <Lock className="w-8 h-8 text-indigo-400" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2 text-center">
          {isSetupMode ? (step === 1 ? 'Set App PIN' : 'Confirm PIN') : 'Enter PIN'}
        </h2>
        <p className="text-sm text-slate-400 mb-8 text-center">
          {isSetupMode ? 'Create a 4-digit PIN for quick access' : 'Enter your 4-digit PIN to unlock'}
        </p>

        {renderDots()}

        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleInput(num.toString())}
              className="h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl text-xl font-semibold text-white transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div /> {/* Empty space for alignment */}
          <button
            onClick={() => handleInput('0')}
            className="h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl text-xl font-semibold text-white transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl text-xl font-semibold text-slate-400 transition-colors flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LockScreen;
