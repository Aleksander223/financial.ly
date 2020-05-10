const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    if (!req.cookies["Authorization"]) {
      throw new Error({ error: "Not auth-ed" });
    }
    const token = req.cookies["Authorization"].replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    // const user = User.findOne({ _id: data._id });
    let user = await User.findById(data._id);

    if (!user) {
      throw new Error({ error: "Not auth-ed" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.log(error);
    // res.status(403).send({ error: "Not auth-ed" });
    res.status(300).redirect("/login");
  }
};

module.exports = auth;
