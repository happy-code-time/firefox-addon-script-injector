import Encryption from '../Cryption/encryption';

const salt = process.env.SALT;

const encryptValue = (value: string) => {
  const encryption = new Encryption();
  return encryption.encrypt(value, salt);
};

export default encryptValue;
