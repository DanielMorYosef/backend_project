import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import morgan from "morgan";
import moment from "moment";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  await mongoose.connect(
    process.env.NODE_ENV == "development"
      ? process.env.MONGO_DB_URL
      : process.env.MONGO_DB_URL_PROD
  );
  console.log("mongodb connection established on port 27017");
}

main().catch((err) => console.log(err));

export const app = express();

app.use(express.json());

app.use(morgan(":method :url :status :date[iso] :response-time ms"));

app.use(
  morgan((tokens, req, res) => {
    const status = tokens.status(req, res);

    return [
      chalk.blue(tokens.method(req, res)),
      chalk.green(tokens.url(req, res)),
      status >= 200 && status < 400
        ? chalk.bgGreen(tokens.status(req, res))
        : chalk.bgRed(tokens.status(req, res)),
      chalk.gray(moment().format("YYYY-MM-DD HH:mm")),
      chalk.bgBlack(tokens["response-time"](req, res), "ms"),
    ].join(" ");
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);

app.use((req, res, next) => {
  const fileName = "log_" + moment().format("YYYY-MM-DD") + ".txt";

  res.on("finish", () => {
    if (res.statusCode >= 400) {
      let fileContent = "";
      fileContent += "Date: " + moment().format("YYYY-MM-DD HH:mm:ss") + "\n";
      fileContent += "Method: " + req.method + "\n";
      fileContent += "Status code: " + res.statusCode + "\n";
      fileContent += "URL: " + req.originalUrl + "\n";
      fileContent += "Error: " + res.statusMessage + "\n\n";

      fs.mkdirSync("./logs", { recursive: true });
      fs.appendFile("./logs/" + fileName, fileContent, (err) => {
        if (err) {
          console.error(chalk.red(err));
        }
      });
    }
  });

  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT, () => {
  console.log("listening on port 3001");
});

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to MongoDB!",
  });
});

(async () => {
  await import("./handlers/users/users.mjs");
  await import("./handlers/cards/cards.mjs");
  await import("./handlers/users/auth.mjs");
  await import("./initial-data/initial-data.service.mjs");

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "error-page.html"));
  });
})();

// go over the test lesson and do what yonatan said to do how to add good documentation
