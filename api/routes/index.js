const express = require("express");
const { allArticles, addArticle, oneArticle, fullUpdateOneArticle, partialUpdateOneArticle, article } = require("../controller/articles.controller");
const { allComments, addComment } = require("../controller/comments.controller");

const router = express.Router();

router.route("/articles")
    .get(allArticles)
    .post(addArticle);

router.route("/articles/:articleId")
    .get(oneArticle)
    .put(fullUpdateOneArticle)
    .patch(partialUpdateOneArticle)
    .delete(article);

router.route("/articles/:articleId/comments")
    .get(allComments)
    .post(addComment)


// router.route("/articles/:id/comments/:id")
//     .get(oneComment);


module.exports = router;