import nodemailer from "nodemailer";
import { google } from "googleapis";

import config from "../config/index.js";

const auth = new google.auth.OAuth2(
  config.emailClientId,
  config.emailClientSecret,
  config.emailRedirectUri
);

auth.setCredentials({ refresh_token: config.emailRefreshToken });

const createTransporter = async () => {
  const accessToken = await auth.getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.emailAddress,
      clientId: config.emailClientId,
      clientSecret: config.emailClientSecret,
      refreshToken: config.emailRefreshToken,
      accessToken,
    },
  });
};

export const sendEmail = async (name, address, subject, text) => {
  const transporter = await createTransporter();
  const options = {
    from: { name: config.apiName, address: config.emailAddress },
    to: { name, address },
    subject,
    text,
  };
  return await transporter.sendMail(options);
};
