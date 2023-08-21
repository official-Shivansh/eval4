const mongoose = require("mongoose");
const blaklistSchema = new mongoose.Schema({
    blacklist :{type : [String]}
})
const BlacklistModel = mongoose.model("blacklist", blaklistSchema);
module.exports = BlacklistModel