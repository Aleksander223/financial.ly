const express = require("express");
const staticRouter = require("./routers/static");
const cookieParser = require("cookie-parser");
const db = require("./../../backend/db/db");

const port = process.env.PORT || 6969;
const dbUrl = process.env.DBURL;

db.connect(dbUrl).catch(() => {
  console.log("::::Error during connection to the database." + dbUrl);
  process.exit(1);
});

const app = express();

app.use(cookieParser());
app.use(staticRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
