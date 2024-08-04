const express = require("express");
const { allArticles, addArticle, oneArticle, fullUpdateOneArticle, partialUpdateOneArticle, article } = require("./articles.controller");
const router = express.Router();

router.route("/")
    .get(allArticles)
    .post(addArticle);

router.route("/:articleId")
    .get(oneArticle)
    .put(fullUpdateOneArticle)
    .patch(partialUpdateOneArticle)
    .delete(article);


module.exports = router;