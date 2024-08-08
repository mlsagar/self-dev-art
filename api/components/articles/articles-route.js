const express = require("express");
const { allArticles, addArticle, oneArticle, fullUpdateOneArticle, partialUpdateOneArticle, removeArticle } = require("./articles-controller");
const authenticate = require("../authentication/authentication-controller");
const router = express.Router();

router.route("/")
    .get(authenticate, allArticles)
    .post(addArticle);

router.route(process.env.ROUTE_WITH_ARTICLE_ID)
    .get(oneArticle)
    .put(fullUpdateOneArticle)
    .patch(partialUpdateOneArticle)
    .delete(removeArticle);


module.exports = router;