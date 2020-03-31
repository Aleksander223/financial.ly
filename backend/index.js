const express = require("express");
const validator = require("validator");

const db = require("./db/db");

const userRouter = require("./routers/user");

const port = process.env.PORT || 6969;
const dbUrl = process.env.DBURL;
const corsUrl = process.env.CORS;

//connect to the database

db.connect(dbUrl).catch(() => {
  console.log("::::Error during connection to the database." + dbUrl);
  process.exit(1);
});

const app = express();

app.use(express.json());
app.use("/res", express.static("../frontend/res"));

app.use("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", corsUrl);
  next();
});

app.use(userRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
