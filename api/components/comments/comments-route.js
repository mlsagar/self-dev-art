const express = require("express");
const { allComments, addComment, oneComment, fullUpdateOneComment, partialUpdateOneComment, removeComment } = require("./comments.controller");

const router = express.Router({mergeParams: true});

router.route("/")
    .get(allComments)
    .post(addComment)


router.route(process.env.ROUTE_WITH_COMMENT_ID)
    .get(oneComment)
    .put(fullUpdateOneComment)
    .patch(partialUpdateOneComment)
    .delete(removeComment);


module.exports = router;