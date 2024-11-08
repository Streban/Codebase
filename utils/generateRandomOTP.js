const generateRandomOTP = () => {
  return (
    new Date().getTime().toString().slice(-4) +
    "" +
    Math.floor(Math.random() * 9999999)
      .toString()
      .slice(-2)
  );
};

module.exports = {
  generateRandomOTP,
};
