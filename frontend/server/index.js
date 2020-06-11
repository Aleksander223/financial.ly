require('dotenv').config({path: __dirname + '/.env'})

const express = require("express");
const staticRouter = require("./routers/static");
const cookieParser = require("cookie-parser");
const db = require("./../../backend/db/db");
const fs = require('fs');
const morgan = require('morgan');
const path = require('path')

const port = process.env.PORT || 9999;
const dbUrl = process.env.DBURL;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'financial.ly.log'), {flags: 'a'})

const cors = require("cors");

db.connect(dbUrl).catch(() => {
  console.log("::::Error during connection to the database." + dbUrl);
  process.exit(1);
});

const app = express();
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[header]', { stream: accessLogStream }));

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
