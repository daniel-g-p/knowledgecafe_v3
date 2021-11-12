import config from "../config/index.js";

export const tryCatch = (controllerFunction) => {
  return async (req, res, next) => {
    try {
      return controllerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const errorHandler = (error, req, res, next) => {
  if (config.nodeEnv === "development") {
    console.log(error);
  }
  const msg = "Ein Fehler ist aufgetreten, bitte versuche es später nochmal.";
  return res.status(500).json({ ok: false, message: msg });
};

export const catchAllRoute = (req, res, next) => {
  return res.status(400).send("Endpoint not found.");
};
