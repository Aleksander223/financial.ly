const User = require("../models/user.js");

const getName = async function(req, resp) {
    const id = req.params.id;

    console.log(id)

    try {
        let u = await User.findById(id); 

        if (!u) {
            resp.status(404).json({message: "User not found"})
        }

        return resp.status(200).json({
            username: u.username
        })
    } catch (error) {
        resp.status(400).json({ status: 400, message: err.message });
    }


}

module.exports = {
    getName
}