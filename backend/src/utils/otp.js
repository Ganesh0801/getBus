exports.generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
exports.expiry = (minutes = 10) => new Date(Date.now() + minutes * 60 * 1000);
exports.isValid = (record, otp) =>
  record && record.otp === otp && record.expiresAt > new Date();
