import express from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

import config from "./config/index.js";

import { connectToDatabase } from "./database/connect.js";
import { errorHandler, catchAllRoute } from "./middleware/errors.js";

import shopRouter from "./routes/shop.js";
import accountRouter from "./routes/account.js";
import ordersRouter from "./routes/orders.js";
import eventsRouter from "./routes/events.js";
import productsRouter from "./routes/products.js";
import teamRouter from "./routes/team.js";

const app = express();

app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(config.cookieSecret));
app.use(express.json());

app.use("/shop", shopRouter);
app.use("/account", accountRouter);
app.use("/orders", ordersRouter);
app.use("/events", eventsRouter);
app.use("/products", productsRouter);
app.use("/team", teamRouter);

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
