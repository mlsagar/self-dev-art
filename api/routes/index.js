const express = require("express");
const articleRouter = require("../components/articles/articles-route");
const commentRouter = require("../components/comments/comments-route");

const router = express.Router();

router.use(process.env.ROUTE_ARTICLES, articleRouter);
articleRouter.use(process.env.ROUTE_ARTICLE_ID_WITH_COMMENTS, commentRouter);


module.exports = router;