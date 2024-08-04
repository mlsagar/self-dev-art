const express = require("express");
const articleRouter = require("../components/articles/articles-route");
const commentRouter = require("../components/comments/comments-route");

const router = express.Router();

router.use("/articles", articleRouter);
articleRouter.use("/:articleId/comments", commentRouter);


module.exports = router;