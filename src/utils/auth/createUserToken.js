const createJWTToken = require("./createJWTToken")

module.exports = (user) => {
  const access = createJWTToken(user, "access");
  const refresh = createJWTToken(user, "refresh");
  return {access, refresh};
};
