import Encryption from '../Cryption/encryption';

const salt = process.env.SALT;

const decryptValue = (value: string) => {
  const encryption = new Encryption();
  return encryption.decrypt(value, salt);
};

export default decryptValue;
