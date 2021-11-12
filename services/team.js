import database from "../database/access.js";

import { validate, condition } from "../utilities/validation.js";

import newUser from "../models/user.js";

export default {
  validateNewMember(user) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const data = {
      email: user.email.toLowerCase().trim(),
      role: user.role.toLowerCase() === "admin" ? "admin" : "user",
    };
    return validate(
      data,
      condition(data.email, "Bitte gebe eine Emailadresse ein."),
      condition(
        emailRegex.test(data.email),
        "Bitte gebe eine gültige Emailadresse ein."
      ),
      condition(data.role, "Ungültiger Status.")
    );
  },
  async createNewMember(email, role) {
    let token = "";
    for (let i = 0; i < 6; i++) {
      token = `${token}${Math.floor(Math.random() * 10)}`;
    }
    const member = newUser(email, role, token);
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
