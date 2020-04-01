const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");


const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await UserModel.findOne({ _id: data._id });

        if (!user) {
            throw new Error({ error: "Not auth-ed" });
        }

        req.user = user;
        req.token = token;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    };
};


module.exports = auth;