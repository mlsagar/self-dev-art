const mongoose = require("mongoose");
const Article = mongoose.model(process.env.MODEL_NAME)

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
        return;
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").exec()
        .then(_handleOneComment.bind(null, responseCollection, commentId))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
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
        return;
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").exec()
        .then(_handleUpdateComment.bind(null, request, responseCollection, _fullUpdateComment))
        .then(_setSuccessResponseCollectionAfterArticleSave.bind(null, responseCollection, process.env.FULL_UPDATE_COMMENT_SUCCESS_MESSAGE))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const partialUpdateOneComment = function (request, response) {
    const commentId = request.params.commentId;
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_COMMENT_ID_MESSAGE });
        return;
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").exec()
        .then(_handleUpdateComment.bind(null, request, responseCollection, _partialUpdateComment))
        .then(_setSuccessResponseCollectionAfterArticleSave.bind(null, responseCollection, process.env.PARTIAL_UPDATE_COMMENT_SUCCESS_MESSAGE))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}
    
const removeComment = function (request, response) {
    const commentId = request.params.commentId;
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }
    if (!mongoose.isValidObjectId(commentId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_COMMENT_ID_MESSAGE });
        return;
    }

    const responseCollection = _createResponseCollection();

    Article.findById(articleId).select("comments").exec()
        .then(_handleRemoveComment.bind(null, request, responseCollection))
        .then(_setSuccessResponseCollectionAfterArticleSave.bind(null, responseCollection, process.env.DELETE_COMMENT_MESSAGE))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const _handleAllComments = function (responseCollection, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);
        return;
    }
    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = article.comments;
}

const _handleAddComment = function (request, responseCollection, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);
        return;
    }
    article.comments.push(_createNewComment(request));
    return article.save();

}

const _handleOneComment = function (responseCollection, commentId, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);
        return;
    }
    const selectedComment = article.comments.id(commentId);

    if (!selectedComment) {
        _setResponseCollectionForAbsenceOfCommentID(responseCollection);
        return;
    }
    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = article.comments.id(commentId);    
}

const _handleUpdateComment = function (request, responseCollection, updateCallback, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);    
        return;
    }
    const selectedComment = article.comments.id(request.params.commentId);
    if (!selectedComment) {
        _setResponseCollectionForAbsenceOfCommentID(responseCollection);
        return;
    }
    updateCallback(selectedComment, request);
    return article.save();    
}

const _fullUpdateComment = function(selectedComment, request) {
    selectedComment.name = request.body.name;
    selectedComment.comment = request.body.comment;
}

const _partialUpdateComment = function(selectedComment, request) {
    if (request.body && request.body.name) {selectedComment.name = request.body.name}
    if (request.body && request.body.comment) {selectedComment.comment = request.body.comment}
}

const _handleRemoveComment = function (request, responseCollection, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);    
        return;
    }
    const selectedComment = article.comments.id(request.params.commentId);
    if (!selectedComment) {
        _setResponseCollectionForAbsenceOfCommentID(responseCollection);
        return;
    }
    selectedComment.deleteOne();
    return article.save();
}

const _setResponseCollectionForAbsenceOfArticle = function(responseCollection) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = { message: process.env.BAD_REQUEST_MESSAGE };    
}

const _setResponseCollectionForAbsenceOfCommentID = function( responseCollection) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = {message: process.env.COMMENT_ID_NOT_FOUND_MESSAGE}
}

const _setSuccessResponseCollectionAfterArticleSave = function(responseCollection, message, saveComment) {
    if (saveComment) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = { message };
    }
}

const _createNewComment = function(request) {
    return {
        comment: request.body.comment,
        name: request.body.name
    }
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
    removeComment
}