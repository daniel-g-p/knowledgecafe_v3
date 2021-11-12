import argon2 from "argon2";

const options = { hashLength: 40, timeCost: 4, memoryCost: 5120 };

export const hash = async (string) => {
  return await argon2.hash(string, options);
};

export const verifyHash = async (hash, string) => {
  return await argon2.verify(hash, string, options);
};