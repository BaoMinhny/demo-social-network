import CryptoJS from 'crypto-js';

const algorithm = 'aes-256-ctr';
const secretKey = 'VjZ2hzuKgbMD1a5lBGuHg7T25T3E3PbT';  // Secret key này cần được bảo mật và không được công khai

const encryptText = (text, key) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Hàm giải mã văn bản
const decryptText = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};


export { encryptText, decryptText };