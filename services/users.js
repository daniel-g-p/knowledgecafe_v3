import database from "../database/access.js";

import { condition, validate } from "../utilities/validation.js";
import { hash, verifyHash } from "../utilities/passwords.js";

export default {
  validateLogin(user, password) {
    const userValid = user ? true : false;
    const passwordValid = password ? true : false;
    return validate(
      { user, password },
      condition(
        userValid,
        "Bitte gebe deinen Benutzernamen oder deine Email an."
      ),
      condition(passwordValid, "Bitte gebe dein Passwort ein.")
    );
  },
  async findUserByLogin(login) {
    const query = { $or: [{ username: login }, { email: login }] };
    const users = await database.find("users", query, ["_id", "password"]);
    return users[0];
  },
  async userExists(id) {
    const user = await database.findById("users", id, ["_id"]);
    return user ? true : false;
  },
  async getUserData(id) {
    const fields = ["name", "email", "username", "role"];
    return await database.findById("users", id, fields);
  },
  validateEdits(user) {
    const data = {
      name: user.name.trim(),
      email: user.email.toLowerCase().trim(),
      username: user.username.toLowerCase().trim(),
    };
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    const emailValid = data.email && emailRegex.test(data.email);
    const usernameValid = data.username && usernameRegex.test(data.username);
    return validate(
      data,
      condition(data.name, "Bitte gebe einen Namen ein."),
      condition(emailValid, "Bitte gebe eine gültige Emailadresse ein."),
      condition(usernameValid, "Bitte gebe einen gültigen Benutzernamen ein.")
    );
  },
  async usernameAvailable(username, userId) {
    const users = await database.find("users", { username }, ["_id"]);
    return !users.length || users[0]._id.toString() === userId;
  },
  async emailAvailable(email, userId) {
    const users = await database.find("users", { email }, ["_id"]);
    return !users.length || users[0]._id.toString() === userId;
  },
  async editUser(userId, edits) {
    return await database.updateById("users", userId, edits);
  },
  validatePasswordEdit(data) {
    const regex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[._\-!?@#$%^&+=])./;
    const passwordValid = regex.test(data.newPassword);
    const passwordsMatch = data.confirmPassword === data.newPassword;
    return validate(
      data,
      condition(data.oldPassword, "Bitte gebe dein altes Passwort ein."),
      condition(data.newPassword, "Bitte gebe ein neues Passwort ein."),
      condition(
        passwordValid,
        "Dein Passwort muss mindestens 1 Großbuchstaben, 1 Kleinbuchstaben, 1 Zahl, und ein Sonderzeichen enthalten."
      ),
      condition(data.confirmPassword, "Bitte bestätige dein Passwort."),
      condition(passwordsMatch, "Die Passwörter stimmen nicht überein.")
    );
  },
  async passwordIsCorrect(userId, password) {
    const user = await database.findById("users", userId, ["password"]);
    return await verifyHash(user.password, password);
  },
  async changePassword(userId, password) {
    const pwHash = await hash(password);
    return await database.updateById("users", userId, { password: pwHash });
  },
  async userIsAdmin(userId) {
    const user = await database.findById("users", userId, ["role"]);
    return user.role === "admin";
  },
  async prepareVerification(userId) {
    const fields = ["email", "name", "token", "verified"];
    const user = await database.findById("users", userId, fields);
    if (!user) {
      return false;
    }
    const verificationValid = user.token.expires > new Date().getTime() && !user.verified
    if (!verificationValid) {
      await database.updateById("users", userId, { token: {} });
    }
    return verificationValid ? user : false;
  },
  validateRegistrationData(user) {
    const data = {
      name: user.name ? user.name.trim() : "",
      email: user.email ? user.email.toLowerCase().trim() : "",
      username: user.username,
      password: user.password,
      confirmPassword: user.confirmPassword,
      token: user.token,
    };
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    const passwordRegex =
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[._\-!?@#$%^&+=])./;
    return validate(
      data,
      condition(data.name, "Bitte gebe einen Namen ein."),
      condition(data.email, "Bitte gebe eine Emailadresse ein."),
      condition(
        emailRegex.test(data.email),
        "Bitte gebe ein gültige Emailadresse an."
      ),
      condition(data.username, "Bitte gebe einen Benutzernamen ein."),
      condition(
        usernameRegex.test(data.username),
        "Der Benutzername enthält ungültige Sonderzeichen."
      ),
      condition(data.password, "Bitte gebe ein Passwort ein."),
      condition(
        passwordRegex.test(data.password),
        "Dein Password muss mindestes 1 Großbuchtaben, 1 Kleinbuchstaben, 1 Zahl, und 1 Sonderzeichen enthalten."
      ),
      condition(data.confirmPassword, "Bitte bestätige dein Passwort."),
      condition(
        data.confirmPassword === data.password,
        "Die Passwörter stimmen nicht überein."
      ),
      condition(data.token, "Bitte gebe deinen Sicherheitscode ein."),
      condition(
        data.token.length === 6,
        "Der 6-stellige Sicherheitscode ist ungültig."
      )
    );
  },
  async checkVerification(userId, email, token) {
    const user = await database.findById("users", userId, ["email", "token"]);
    return validate(
      user,
      condition(
        user.email === email,
        "An die Emailadresse wurde keine Einladung verschickt."
      ),
      condition(
        user.token.secret === token,
        "Bitte überprüfe deinen Sicherheitscode."
      ),
      condition(
        user.token.expires > new Date().getTime(),
        "Der Anmeldelink ist abgelaufen."
      )
    );
  },
  async completeRegistration(userId, name, username, password) {
    const passwordHash = await hash(password);
    const update = {
      name,
      username,
      password: passwordHash,
      verified: true,
    };
    return await database.updateById("users", userId, update);
  },
};
