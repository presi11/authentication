import { createRoles } from "./libs/initialSetup";

const express = require("express");
const morgan = require("morgan");
const pkg = require("../package.json");

import authRoutes from "./routes/auth.routes";

const app = express();
createRoles();
app.set("pkg", pkg);

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    author: app.get("pkg").author,
  });
});

app.use("/api/auth", authRoutes);

export default app;
