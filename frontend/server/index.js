require('dotenv').config({path: __dirname + '/.env'})

const express = require("express");
const staticRouter = require("./routers/static");
const cookieParser = require("cookie-parser");
const db = require("./../../backend/db/db");

const port = process.env.PORT || 9999;
const dbUrl = process.env.DBURL;

const cors = require("cors");

db.connect(dbUrl).catch(() => {
  console.log("::::Error during connection to the database." + dbUrl);
  process.exit(1);
});

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(staticRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
