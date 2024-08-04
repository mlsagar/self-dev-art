const express = require("express");
const { allComments, addComment, oneComment, fullUpdateOneComment, partialUpdateOneComment, comment } = require("./comments.controller");

const router = express.Router({mergeParams: true});

router.route("/")
    .get(allComments)
    .post(addComment)


router.route(process.env.ROUTE_WITH_COMMENT_ID)
    .get(oneComment)
    .put(fullUpdateOneComment)
    .patch(partialUpdateOneComment)
    .delete(comment);


module.exports = router;