const express = require("express")
const { PostModel } = require("../model/postModel");
const bcrypt = require("bcrypt");


const postRouter = express.Router();



postRouter.get("/", async (req, res) => {
    const { pageNo, limit, minCmt, maxCmt, div1, div2 } = req.query;
    const skip = (pageNo - 1) * limit;
    const { userId } = req.body;
    const query = {};
    if (userId) {
        query.userId = userId;

    }
    if (minCmt && maxCmt) {
        query.no_of_comments = {
            $and: [
                { no_of_comments: { $gt: minCmt } },
                { no_of_comments: { $lt: maxCmt } }
            ]
        }
    }
    if (div1 && div2) {
        query.device = {
            $and: [
                { device: div1 },
                { device: div2 }
            ]
        }
    }
    else if (div1) {
        query.device = div1;
    }
    try {
        const posts = await PostModel.find(query)
            .sort({ no_of_comments: 1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ msg: "Posts", posts })
    }
    catch (err) {
        res.status(400).json({ err: err.message })

    }

})

postRouter.get("/top", async (req, res) => {
    const { pageNo } = req.query;
    const limit = 3;
    const skip = (pageNo - 1) * limit;

    try {
        const postsTop = await PostModel.findOne()
            .sort({ no_of_comments: -1 })
            .skip(skip)
            .limit(limit)
        res.status(200).json({ msg: "Posts", postsTop })
    }
    catch (err) {
        res.status(400).json({ err: err.message })
    }
})

postRouter.post("/add", async (req, res) => {
    const { userId } = req.body;
    try {
        const post = new PostModel.find({ ...req.body });
        await post.save();
        res.status(200).json({ msg: "post added" })
    }
    catch (err) {
        res.status(400).json({ err: err.message })
    }
})
postRouter.patch("/update/:postId", async (res, req) => {
    const { postId } = req.param;
    const { userId } = req.body;
    try {
        const post = await PostModel.findByIdAndUpdate({
            userId,
            _id: postId
        }, req.body)
        if (post) {
            res.status(200).json({ msg: "Post updated successfully" })
        }
        else {
            res.status(400).json({ msg: "not found" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
postRouter.delete("/delete/:postId", async (res, req) => {
    const { postId } = req.param;
    const { userId } = req.body;
    try {
        const post = await PostModel.findByIdAndDelete({
            userId,
            _id: postId
        }, req.body)
        if (post) {
            res.status(200).json({ msg: "Post deleted successfully" })
        }
        else {
            res.status(400).json({ msg: "not found" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = {
    postRouter
}
