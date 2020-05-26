const getUniqueStr = (salt = 1000) => {
  return (
    new Date().getTime().toString(16) +
    Math.floor(salt + Math.random()).toString(16)
  );
};

export default getUniqueStr;
