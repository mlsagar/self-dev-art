const express = require("express");
const articleRouter = require("../components/articles/articles-route");
const commentRouter = require("../components/comments/comments-route");
const userRouter = require("../components/users/users-route");
const uploadRouter = require("../components/uploads/uploads-route");

const router = express.Router();

router.use(process.env.ROUTE_ARTICLES, articleRouter);
articleRouter.use(process.env.ROUTE_ARTICLE_ID_WITH_COMMENTS, commentRouter);
router.use(process.env.ROUTE_USERS, userRouter)
router.use(process.env.ROUTE_UPLOAD, uploadRouter)


module.exports = router;