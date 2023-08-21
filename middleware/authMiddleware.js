const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklistmodel");
require("dotenv").config()
const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        let existingToken = await BlacklistModel.find({
            blacklist : {$in: token}
        })
        if(existingToken){
            res.status(200).json("Login successfully")
        }
        else{
            const decoded = jwt.verify(token,process.env.SECRETKEY);
            req.body.userID = decoded.userID;
            next();
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}
module.exports = { auth }