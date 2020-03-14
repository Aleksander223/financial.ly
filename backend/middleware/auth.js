const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.js");



const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", '');
		console.log(token);
		const data = jwt.verify(token, "igothoeeeeeeeeeesniggacat");
		console.log(data._id);
		const user = await UserModel.findOne({ _id: data._id });

		if (!user) {
			throw new Error({ error: "Not auth-ed" });
		}

		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).send({ error });
	};
};

module.exports = auth;