import Encryption from '../Cryption/encryption';

const salt = process.env.SALT;

const getAuthentication = (name: string, decrypt = false) => {
  const encrypted = localStorage.getItem(name);

  if (decrypt && encrypted !== null) {
    const encryption = new Encryption();
    return encryption.decrypt(encrypted, salt);
  }

  return encrypted;
};

export default getAuthentication;