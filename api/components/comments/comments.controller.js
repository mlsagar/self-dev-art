const { response } = require("express");
const mongoose = require("mongoose");
const Article = mongoose.model(process.env.MODEL_NAME)
const callbackify = require("util").callbackify;

const _Comment = function (artilceId) {
    return Article.findById(artilceId).select("comments");
}

const allComments = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
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
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_OFFSET_COUNT_MESSAGE });
        return;
    }

    if (count > maxCount) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: `${process.env.MAX_LIMIT_MESSAGE} ${maxCount}` });
        return;
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").skip(offset).limit(count).exec()
        .then(_handleAllComments.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const handleArticleFindByIdSelectExecCallbackify = function (articleId) {
    return _Comment(articleId).exec();
}
const articleFindByIdSelectExecWithCallbackify = callbackify(handleArticleFindByIdSelectExecCallbackify);

const addComment = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").exec()
        .then(_handleAddComment.bind(null, request, responseCollection))
        .then(_setSuccessResponseCollectionAfterArticleSave.bind(null, responseCollection, process.env.COMMENT_POST_SUCCESS_MESSAGE))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const oneComment = function (request, response) {
    const commentId = request.params.commentId;
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_COMMENT_ID_MESSAGE });
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").exec()
        .then(_handleOneComment.bind(null, responseCollection, commentId))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}


const handleUpdateComment = function (request, response, error, article) {
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

        articleSaveWithCallbackify(article, handleAddDeleteAndUpdateComment.bind(null, "Updated", response))
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }
}
const fullUpdateOneComment = function (request, response) {
    const commentId = request.params.commentId;
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_COMMENT_ID_MESSAGE });
    }
    articleFindByIdSelectExecWithCallbackify(articleId, handleUpdateComment.bind(null, request, response));
}


const partialUpdateOneComment = function (request, response) {
    fullUpdateOneComment(request, response);
}


const handleDeleteComment = function (request, response, error, article) {
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
        let selectedComment = article.comments.id(request.params.commentId);

        if (!selectedComment) {
            response.status(404).json({ message: "Comment not found" });
        }

        selectedComment.deleteOne();

        articleSaveWithCallbackify(article, handleAddDeleteAndUpdateComment.bind(null, "Deleted", response))
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }
}
const comment = function (request, response) {
    const commentId = request.params.commentId;
    const articleId = request.params.articleId;
    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_COMMENT_ID_MESSAGE });
    }
    articleFindByIdSelectExecWithCallbackify(articleId, handleDeleteComment.bind(null, request, response));
}


const handleArticleSaveCallbackify = function (article) {
    return article.save();
}
const articleSaveWithCallbackify = callbackify(handleArticleSaveCallbackify);
const handleAddDeleteAndUpdateComment = function (action, response, error) {
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

const _handleAllComments = function (responseCollection, article) {
    if (!article) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = { message: process.env.BAD_REQUEST_MESSAGE };
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = article.comments;
}

const _handleAddComment = function (request, responseCollection, article) {
    if (!article) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = { message: process.env.BAD_REQUEST_MESSAGE };
        return;
    }

    const newComment = {
        comment: request.body.comment,
        name: request.body.name
    }

    article.comments.push(newComment);
    return article.save();

}
const _setSuccessResponseCollectionAfterArticleSave = function(responseCollection, message, saveComment) {
    if (saveComment) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = { message };
    }
}

const _handleOneComment = function (responseCollection, commentId, article) {
    if (!article) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = { message: process.env.BAD_REQUEST_MESSAGE };
        return;
    }

    
    if (!article.comments.id(commentId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = {message: process.env.COMMENT_ID_NOT_FOUND_MESSAGE}
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = article.comments.id(commentId);
    
}

const _createResponseCollection = function () {
    return {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
}

const _setInternalError = function (responseCollection, error) {
    responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
    responseCollection.message = error;
}

const _sendResponse = function (response, responseCollection) {
    response.status(responseCollection.status).json(responseCollection.message)
}


module.exports = {
    allComments,
    addComment,
    oneComment,
    fullUpdateOneComment,
    partialUpdateOneComment,
    comment
}