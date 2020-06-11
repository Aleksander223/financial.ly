require('dotenv').config({path: __dirname + '/.env'})

const express = require("express");
const validator = require("validator");
const db = require("./db/db.js");
const userRouter = require("./routers/user.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const transactionRouter = require("./routers/transaction.js");
const walletRouter = require("./routers/wallet.js")
const userInfoRouter = require("./routers/userInfo.js")
const fs = require('fs');
const morgan = require('morgan');
const path = require('path')

const port = process.env.PORT || 6969;
const dbUrl = process.env.DBURL;
const corsUrl = process.env.CORS;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'financial.ly.log'), {flags: 'a'})

async function main() {
  try {
    await db.connect(dbUrl);
  } catch (except) {
    console.log("::::Error during connection to the database.");
    console.error(except);
    process.exit(1);
  }

  const app = express();
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[header]', { stream: accessLogStream }));

  app.use(cookieParser());
  app.use(express.json());

  app.use(
    cors({
      origin: function (origin, callback) {
        return callback(null, true);
      },
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );

  app.use(userRouter);
  app.use(transactionRouter);
  app.use(walletRouter);
  app.use(userInfoRouter);

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

main();
