const User = require("../models/user.js");

const getName = async function (req, resp) {
    const id = req.params.id


    try {
        let u = await User.findById(id);

        if (!u) {
            resp.status(404).json({
                message: "User not found"
            })
        }

        return resp.status(200).json({
            username: u.username
        })
    } catch (error) {
        resp.status(400).json({
            status: 400,
            message: error.message
        });
    }


}

const getID = async function (req, resp) {
    const name = req.params.name

    console.log(name)

    try {
        let u = await User.findOne({
            username: name
        });

        if (!u) {
            return resp.status(404).json({
                message: "User not found"
            })
        }

        return resp.status(200).json({
            _id: u._id
        })
    } catch (error) {
        resp.status(400).json({
            status: 400,
            message: error.message
        });
    }
}

module.exports = {
    getName,
    getID
}