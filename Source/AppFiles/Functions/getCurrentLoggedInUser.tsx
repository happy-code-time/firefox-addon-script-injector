import getAuthentication from './getAuthentication';

const getCurrentLoggedInUser = (decrypt = false) => {
  return getAuthentication('authentication', decrypt);
};

export default getCurrentLoggedInUser;
