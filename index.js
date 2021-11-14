import express from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import historyApiFallback from "connect-history-api-fallback";

import config from "./config/index.js";

import { connectToDatabase } from "./database/connect.js";

import { errorHandler, catchAllRoute } from "./middleware/errors.js";

import shopRouter from "./routes/shop.js";
import accountRouter from "./routes/account.js";
import ordersRouter from "./routes/orders.js";
import eventsRouter from "./routes/events.js";
import productsRouter from "./routes/products.js";
import teamRouter from "./routes/team.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(config.cookieSecret));
app.use(express.json());

app.use("/api/shop", shopRouter);
app.use("/api/account", accountRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/products", productsRouter);
app.use("/api/team", teamRouter);

app.use(historyApiFallback());
app.use(express.static(path.join(__dirname, "views")));
app.get((req, res, next) => {
  return res.sendFile("index.html");
});

app.use(errorHandler);
app.use(catchAllRoute);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(config.port, () => {
      if (config.nodeEnv === "development") {
        console.log(`Serving on http://localhost:${config.port}`);
      }
    });
  } catch (error) {
    if (config.nodeEnv === "development") {
      console.log(error);
    }
  }
};

startServer();
