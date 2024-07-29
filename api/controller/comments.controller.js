const mongoose = require("mongoose");
const Article = mongoose.model(process.env.ARTICLE_MODEL)
const callbackify = require("util").callbackify;

const _Comment = function (artilceId) {
    return Article.findById(artilceId).select("comments");
}


const handleCommentSkipLimitExecCallbackify = function (articleId, offset, count) {
    return _Comment(articleId).skip(offset).limit(count).exec();
}
const commentSkipLimitExecWithCallbackify = callbackify(handleCommentSkipLimitExecCallbackify);
const handleAllComments = function (response, error, article) {
    const responseCollection = {
        status: 200,
        message: article.comments
    }
    if (error) {
        responseCollection.status = 500,
            responseCollection.message = error
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const allComments = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }
    let offset = parseInt(process.env.INITIAL_FIND_OFFSET, process.env.RADIX_VALUE);
    let count = parseInt(process.env.INITIAL_FIND_COUNT, process.env.RADIX_VALUE);
    const maxCount = parseInt(process.env.INITIAL_MAX_FIND_LIMIT, process.env.RADIX_VALUE);

    if (request.query && request.query.offset) {
        offset = parseInt(request.query.offset, process.env.RADIX_VALUE);
    }

    if (request.query && request.query.count) {
        count = parseInt(request.query.count, process.env.RADIX_VALUE);
    }

    if (isNaN(offset) || isNaN(count)) {
        response.status(400).json({ message: "Invalid offset or count" });
        return;
    }

    if (count > maxCount) {
        response.status(400).json({ message: "Cannot exceed count of " + maxCount });
        return;
    }

    commentSkipLimitExecWithCallbackify(articleId, offset, count, handleAllComments.bind(null, response));
}


const handleArticleFindByIdSelectExecCallbackify = function (articleId) {
    return _Comment(articleId).exec();
}
const articleFindByIdSelectExecWithCallbackify = callbackify(handleArticleFindByIdSelectExecCallbackify);
const handleAddArticle = function (request, response, error, article) {
    const responseCollection = {
        status: 200,
        message: article
    }
    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    } else if (!article) {
        responseCollection.status = 404;
        responseCollection.message = { message: "Article ID not found" };
    }

    if (article) {
        _addComment(request, response, article);
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }
}
const addComment = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }

    articleFindByIdSelectExecWithCallbackify(articleId, handleAddArticle.bind(null, request, response));

}


const handleOneComment = function(response, commentId, error, article) {
    const responseCollection = {
        status: 200,
        message: article
    }
    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    } else if (!article) {
        responseCollection.status = 404;
        responseCollection.message = { message: "Article ID not found" };
    }

    if (article) {
        response.status(200).json(article.comments.id(commentId));
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }
}
const oneComment = function (request, response) {
    const articleId = request.params.articleId;
    const commentId = request.params.commentId;
    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(400).json({ message: "Invalid comment id" });
    }

    articleFindByIdSelectExecWithCallbackify(articleId, handleOneComment.bind(null, response, commentId));
}

const handleUpdateComment = function(request, response, error, article) {
    const responseCollection = {
        status: 200,
        message: article
    }
    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    } else if (!article) {
        responseCollection.status = 404;
        responseCollection.message = { message: "Article ID not found" };
    }

    if (article) {
        const selectedComment = article.comments.id(request.params.commentId);

        if (!selectedComment) {
            response.status(404).json({ message: "Comment not found" });
        }

        selectedComment.name = request.body.name;
        selectedComment.comment = request.body.comment;

        articleSaveWithCallbackify(article, handle_AddComment.bind(null, "Updated", response))
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }
}
const fullUpdateOneComment = function (request, response) {
    const articleId = request.params.articleId;
    const commentId = request.params.commentId;
    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(400).json({ message: "Invalid comment id" });
    }
    articleFindByIdSelectExecWithCallbackify(articleId, handleUpdateComment.bind(null, request, response));
}

const partialUpdateOneComment = function (request, response) {

}

const comment = function (request, response) {

}


const handleArticleSaveCallbackify = function (article) {
    return article.save();
}
const articleSaveWithCallbackify = callbackify(handleArticleSaveCallbackify);
const handle_AddComment = function (action, response, error) {
    const responseCollection = {
        status: 200,
        message: { message: `${action} comment successfully!!!` }
    }

    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const _addComment = function (request, response, article) {
    const newComment = {
        comment: request.body.comment,
        name: request.body.name
    }

    article.comments.push(newComment);

    articleSaveWithCallbackify(article, handle_AddComment.bind(null, "Posted", response));
}

module.exports = {
    allComments,
    addComment,
    oneComment,
    fullUpdateOneComment,
    partialUpdateOneComment,
    comment
}