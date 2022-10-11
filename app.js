import express from "express";
import https from "https";
import http from "http";
import path from "path";
import { fs } from "mz";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import { dlog, successMessage, cls } from "./custom_modules/index.js";
import home from "./routers/home/index.js";

// Create __dirname
const __dirname = path.resolve(".");

// Initialize dotenv
dotenv.config();

// HTTPS options
const httpsOptions = letsencryptOptions();

// Initialize express
const app = express();

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// view engine setup
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "layout",
  })
);

// Initialize middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/", home);

// Initialize server
const server = http.createServer(app);

// Start server
server.listen(process.env.PORT, () => {
  cls();
  dlog(successMessage(`\n\tServer listening on port ${process.env.PORT}\n`));
});

function letsencryptOptions(domain = null) {
  let certPath;
  if (null != domain) {
    certPath = "/etc/letsencrypt/live/";
    return {
      key: fs.readFileSync(certPath + domain + "/privkey.pem"),
      cert: fs.readFileSync(certPath + domain + "/cert.pem"),
      ca: fs.readFileSync(certPath + domain + "/chain.pem"),
    };
  } else {
    certPath = path.join(__dirname, "../certi/");
    return {
      key: fs.readFileSync(certPath + "server.key"),
      cert: fs.readFileSync(certPath + "server.cert"),
    };
  }
}
