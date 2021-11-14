import config from "../config/index.js";

import { verifyHash } from "../utilities/passwords.js";
import { signJwtToken, verifyJwtToken } from "../utilities/jwt.js";

import usersService from "../services/users.js";

export default {
  async login(req, res, next) {
    const { user, password } = req.body;
    const { valid, errorMessage, data } = usersService.validateLogin(
      user,
      password
    );
    if (!valid) {
      return res.status(400).json({ message: errorMessage });
    }
    const theUser = await usersService.findUserByLogin(data.user);
    if (!theUser) {
      const message = "Den Benutzer scheint es nicht zu geben.";
      return res.status(400).json({ message });
    }
    const validPassword = await verifyHash(theUser.password, data.password);
    if (!validPassword) {
      const message = "Benutzername und Passwort stimmen nicht überein.";
      return res.status(400).json({ message });
    }
    const jwtToken = signJwtToken(theUser._id.toString());
    const cookieOptions = {
      maxAge: 1000 * 60 * 60 * 24,
      signed: true,
      httpOnly: true,
      secure: config.nodeEnv !== "development",
      domain: config.clientDomain,
    };
    return res
      .status(200)
      .cookie("userId", jwtToken, cookieOptions)
      .json({ ok: true });
  },
  async verifyLogin(req, res, next) {
    const { tokenData } = verifyJwtToken(req.signedCookies.userId);
    if (!tokenData) {
      return res.status(401).json({ message: "Kein Zugriff." });
    }
    const user = await usersService.getUserData(tokenData);
    if (!user) {
      const message = "Kein Zugriff.";
      return res.status(401).clearCookie("userId").json({ message });
    }
    return res.status(200).json({ ok: true, user });
  },
  async getRegistrationPage(req, res, next) {
    const { userId } = req.params;
    const user = await usersService.prepareVerification(userId);
    if (!user) {
      return res.status(400).json({ message: "Der Anmeldelink ist ungültig." });
    }
    return res.status(200).json({ user, ok: true });
  },
  async completeRegistration(req, res, next) {
    const { userId } = req.params;
    const inputValidation = usersService.validateRegistrationData(req.body);
    const { valid, data, message } = inputValidation;
    if (!valid) {
      return res.json({ message });
    }
    const { name, email, username, password, token } = data;
    const credentials = await usersService.checkVerification(
      userId,
      email,
      token
    );
    if (!credentials.valid) {
      return res.json({ message: credentials.message });
    }
    await usersService.completeRegistration(userId, name, username, password);
    return res.status(200).clearCookie("userId").json({ ok: true });
  },
  async getUserData(req, res, next) {
    const { tokenData } = verifyJwtToken(req.signedCookies.userId);
    const user = await usersService.getUserData(tokenData);
    const { name, email, username, role } = user;
    return res.status(200).json({ ok: true, name, email, username, role });
  },
  async editUser(req, res, next) {
    const { data, valid, message } = usersService.validateEdits(req.body);
    if (!valid) {
      return res.status(400).json({ message, status: 400 });
    }
    const { tokenData } = verifyJwtToken(req.signedCookies.userId);
    const usernameAvailable = await usersService.usernameAvailable(
      data.username,
      tokenData
    );
    if (!usernameAvailable) {
      const message = `Der Benutzername "${data.username}"" ist bereits vergeben.`;
      return res.status(400).json({ message });
    }
    const emailAvailable = await usersService.emailAvailable(
      data.email,
      tokenData
    );
    if (!emailAvailable) {
      const message = `Es gibt bereits einen anderen Benutzer mit dieser Emailadresse.`;
      return res.status(400).json({ message });
    }
    await usersService.editUser(tokenData, data);
    return res.status(200).json({ ok: true });
  },
  async changePassword(req, res, next) {
    const validation = usersService.validatePasswordEdit(req.body);
    const { valid, data, errorMessage } = validation;
    if (!valid) {
      return res.status(400).json({ message: errorMessage });
    }
    const { tokenData } = verifyJwtToken(req.signedCookies.userId);
    const correctPassword = await usersService.passwordIsCorrect(
      tokenData,
      data.oldPassword
    );
    if (!correctPassword) {
      const message = "Das eingegebene Passwort ist falsch.";
      return res.status(401).json({ message });
    }
    await usersService.changePassword(tokenData, data.newPassword);
    return res.status(200).clearCookie("userId").json({ ok: true });
  },
  logout(req, res, next) {
    return res.clearCookie("userId").json({ ok: true });
  },
};
