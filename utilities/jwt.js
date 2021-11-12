import jwt from "jsonwebtoken";

import config from "../config/index.js";

export const signJwtToken = (tokenData) => {
  const options = { expiresIn: 60 * 60 * 24 };
  return jwt.sign({ tokenData }, config.jwtSecret, options);
};

export const verifyJwtToken = (jwtToken) => {
  return jwt.verify(jwtToken, config.jwtSecret, (error, data) => {
    return error ? false : data;
  });
};
