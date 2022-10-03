const jwt = require("jsonwebtoken");

const key = "mytokenkey";

const getToken = (_id) => {
  token = jwt.sign(
    {
      _id: _id,
    },
    key
  );

  return token;
};

module.exports = getToken;
