import config from "../config/index.js";

import database from "../database/access.js";

import { sendEmail } from "../utilities/email.js";
import { validate, condition } from "../utilities/validation.js";

import newUser from "../models/user.js";

export default {
  validateNewMember(user) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const data = {
      name: user.name,
      email: user.email.toLowerCase().trim(),
      role: user.role.toLowerCase() === "admin" ? "admin" : "user",
    };
    return validate(
      data,
      condition(data.name, "Bitte gebe einen Namen ein."),
      condition(data.email, "Bitte gebe eine Emailadresse ein."),
      condition(
        emailRegex.test(data.email),
        "Bitte gebe eine gültige Emailadresse ein."
      ),
      condition(data.role, "Ungültiger Status.")
    );
  },
  async sendWelcomeEmail(name, email, userId, token) {
    const subject = "Knowledge Cafe Registrierung";
    const message = `Hallo ${name},\n\nHerzlich willkommen als neues Mitglied im Knowledge Café. Bitte schließe deine Registrierung unter dem beigefügten Link ab um den Zugriff auf dein Konto freizuschalten. Dein Sicherheitscode ist ${token}.\n\n${config.appUrl}/account/registrieren/${userId}.\n\nBei fragen kannst du dich jederzeit beim Orga-Team unter ${config.emailAddress} melden.\n\nViele Grüße,\nDein Knowledge Café.`;
    return await sendEmail(name, email, subject, message);
  },
  createRegistrationToken() {
    let token = "";
    for (let i = 0; i < 6; i++) {
      token = `${token}${Math.floor(Math.random() * 10)}`;
    }
    return token;
  },
  async createNewMember(name, email, role, token) {
    const member = newUser(name, email, role, token);
    return await database.create("users", member);
  },
  async getAllTeamMembers() {
    const fields = ["name", "username", "email", "role", "timestamp"];
    return await database.find("users", { verified: true }, fields);
  },
  async setRole(userId, role) {
    return await database.updateById("users", userId, { role });
  },
  async deleteMember(userId) {
    return await database.deleteById("users", userId);
  },
};
