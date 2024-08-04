const express = require("express");
const { allArticles, addArticle, oneArticle, fullUpdateOneArticle, partialUpdateOneArticle, article } = require("./articles.controller");
const router = express.Router();

router.route("/")
    .get(allArticles)
    .post(addArticle);

router.route(process.env.ROUTE_WITH_ARTICLE_ID)
    .get(oneArticle)
    .put(fullUpdateOneArticle)
    .patch(partialUpdateOneArticle)
    .delete(article);


module.exports = router;