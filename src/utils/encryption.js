import CryptoJS from 'crypto-js';

// In a real app, this should be derived from user password or stored securely.
// We'll use a local storage key for demonstration of end-to-end encryption.
const getSecretKey = () => {
  let key = localStorage.getItem('locker_key');
  if (!key) {
    // Generate a random key if none exists (for demo purposes)
    // In production, the user would provide this to unlock.
    key = CryptoJS.lib.WordArray.random(256 / 8).toString();
    localStorage.setItem('locker_key', key);
  }
  return key;
};

export const encryptData = (data) => {
  if (!data) return data;
  const key = getSecretKey();
  try {
    const stringifiedData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringifiedData, key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  const key = getSecretKey();
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const checkPin = (pin) => {
  const storedPin = localStorage.getItem('locker_pin');
  if (!storedPin) return true; // No pin set yet
  
  // Hash the pin to compare
  const hashedInput = CryptoJS.SHA256(pin).toString();
  return hashedInput === storedPin;
};

export const setPin = (pin) => {
  const hashedPin = CryptoJS.SHA256(pin).toString();
  localStorage.setItem('locker_pin', hashedPin);
};
