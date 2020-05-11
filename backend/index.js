const express = require("express");
const validator = require("validator");
const db = require("./db/db.js");
const userRouter = require("./routers/user.js");
const cookieParser = require("cookie-parser");
const cors = require

const port = process.env.PORT || 6969;
const dbUrl = process.env.DBURL;
const corsUrl = process.env.CORS;



async function main() {
	try {
		await db.connect(dbUrl);
	} catch (except) {
		console.log("::::Error during connection to the database.");
		console.error(except);
		process.exit(1);
	}

	const app = express();

	app.use(cookieParser());
	app.use(express.json());

	app.use("/*", cors);

	app.use(userRouter);

	app.listen(port, () => console.log(`Server running on port ${port}`));
}

main();
