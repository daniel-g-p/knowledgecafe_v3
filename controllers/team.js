import { sendEmail } from "../utilities/email.js";

import teamService from "../services/team.js";
import usersService from "../services/users.js";

export default {
  async getTeamMembers(req, res, next) {
    const team = await teamService.getAllTeamMembers();
    return res.status(200).json({ ok: true, team });
  },
  async setRole(req, res, next) {
    const { userId } = req.params;
    const { role } = req.body;
    if (role !== "admin") {
      const allowed = await teamService.atLeastNAdministrators(2);
      if (!allowed) {
        const message = "Es muss mindestens zwei Administratoren geben.";
        return res.status(400).json({ message });
      }
    }
    await teamService.setRole(userId, role);
    return res.status(200).json({ ok: true });
  },
  async deleteMember(req, res, next) {
    const { userId } = req.params;
    const allowed = await teamService.atLeastNAdministrators(2);
    if (!allowed) {
      const message = "Es muss mindestens zwei Administratoren geben.";
      return res.status(400).json({ message });
    }
    await teamService.deleteMember(userId);
    return res.status(200).json({ ok: true });
  },
  async newUser(req, res, next) {
    const { valid, data, message } = teamService.validateNewMember(req.body);
    if (!valid) {
      return res.status(400).json({ message });
    }
    const emailAvailable = await usersService.emailAvailable(data.email, "");
    if (!emailAvailable) {
      const message = "Es gibt bereits einen Benutzer mit dieser Emailadresse.";
      return res.status(400).json({ message });
    }
    const token = teamService.createRegistrationToken();
    const newUser = await teamService.createNewMember(
      data.name,
      data.email,
      data.role,
      token
    );
    const userId = newUser.insertedId.toString();
    await teamService.sendWelcomeEmail(data.name, data.email, userId, token);
    return res.status(200).json({ ok: true });
  },
};
