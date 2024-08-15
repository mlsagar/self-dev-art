const mongoose = require("mongoose");
const Article = mongoose.model(process.env.ARTICLE_MODEL_NAME);

const allArticles = function (request, response) {
    let offset = parseInt(process.env.INITIAL_FIND_OFFSET, process.env.RADIX_VALUE);
    let count = parseInt(process.env.INITIAL_FIND_COUNT, process.env.RADIX_VALUE);
    const maxCount = parseInt(process.env.INITIAL_MAX_FIND_LIMIT, process.env.RADIX_VALUE);
    const responseCollection = _createResponseCollection();
    if (request.query && request.query.offset) {
        offset = parseInt(request.query.offset, process.env.RADIX_VALUE);
    }

    if (request.query && request.query.count) {
        count = parseInt(request.query.count, process.env.RADIX_VALUE);
    }

    if (isNaN(offset) || isNaN(count)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.INVALID_OFFSET_COUNT_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }

    // if (count > maxCount) {
    //     responseCollection.status = Number(process.env.MAX_COUNT_ERROR_STATUS_CODE );
    //     responseCollection.message = `${process.env.MAX_LIMIT_MESSAGE} ${maxCount}`;
    //     _sendResponse(response, responseCollection);
    //     return;
    // }    

    Article.find().sort({ _id: -1 }).skip(offset).limit(count).exec()
        .then(_handleAllArticles.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const addArticle = function (request, response) {
    const newArticle = {
        title: request.body.title,
        author: request.body.author,
        link: request.body.link,
        imageLink: request.body.imageLink,
        comments: []
    }

    const responseCollection = _createResponseCollection();

    Article.create(newArticle)
        .then(_handleAddArticle.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const oneArticle = function (request, response) {
    const articleId = request.params.articleId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(articleId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message =  process.env.INVALID_ARTICLE_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }    

    Article.findById(articleId).exec()
        .then(_handleOneArticle.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const fullUpdateOneArticle = function (request, response) {
    const articleId = request.params.articleId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(articleId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message =  process.env.INVALID_ARTICLE_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }
    Article.findById(articleId).exec()
        .then(_updateArticle.bind(null, request, responseCollection, _fullUpdateArticle))
        .then(_handleUpdateResponse.bind(null, process.env.FULL_UPDATE_ARTICLE_SUCCESS_MESSAGE, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const partialUpdateOneArticle = function (request, response) {
    const articleId = request.params.articleId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(articleId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message =  process.env.INVALID_ARTICLE_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }    

    Article.findById(articleId).exec()
        .then(_updateArticle.bind(null, request, responseCollection, _partialUpdateArticle))
        .then(_handleUpdateResponse.bind(null, process.env.PARTIAL_UPDATE_ARTICLE_SUCCESS_MESSAGE, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const removeArticle = function (request, response) {
    const articleId = request.params.articleId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(articleId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message =  process.env.INVALID_ARTICLE_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }    

    Article.findByIdAndDelete(articleId).exec()
        .then(_handleRemoveArticle.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const _handleAllArticles = function (responseCollection, articles) {
    if (!articles) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.data = articles;
    responseCollection.message = process.env.SUCCESS_FETCHING_MESSAGE;
}

const _handleAddArticle = function (responseCollection, response) {
    if (!response) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = process.env.ARTICLE_POST_SUCCESS_MESSAGE;
}

const _handleOneArticle = function (responseCollection, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);
        return;
    }
    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE),
    responseCollection.data = [article];
    responseCollection.message = process.env.SUCCESS_FETCHING_MESSAGE;
}

const _updateArticle = function (request, responseCollection, updateArticleCallback, article) {
    if (!article) {
        _setResponseCollectionForAbsenceOfArticle(responseCollection);
        return;
    }

    updateArticleCallback(request, article);
    return article.save()

}

const _handleUpdateResponse = function (message, responseCollection, saveResponse) {
    if (saveResponse) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = message;
    }
}

const _fullUpdateArticle = function (request, article) {
    article.title = request.body.title;
    article.author = request.body.author;
    article.link = request.body.link;
}

const _partialUpdateArticle = function (request, article) {
    if (request.body && request.body.title) { article.title = request.body.title }
    if (request.body && request.body.link) { article.link = request.body.link }
    if (request.body && request.body.author) { article.author = request.body.author }
    if (request.body && request.body.comments) { article.title = request.body.comments }
}

const _handleRemoveArticle = function (responseCollection, deletedArticle) {
    if (!deletedArticle) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = process.env.ARTICLE_ID_NOT_FOUND_MESSAGE;
        return;
    }
    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = process.env.DELETE_ARTICLE_MESSAGE;

}

const _setResponseCollectionForAbsenceOfArticle = function (responseCollection) {
    responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
    responseCollection.message = process.env.ARTICLE_ID_NOT_FOUND_MESSAGE;
}

const _createResponseCollection = function () {
    return {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: "",
        data: []
    }
}

const _setInternalError = function (responseCollection, error) {
    responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
    responseCollection.message = error;
}

const _sendResponse = function (response, responseCollection) {
    response.status(responseCollection.status).json({
        ...responseCollection
    })
}

module.exports = {
    allArticles,
    addArticle,
    oneArticle,
    fullUpdateOneArticle,
    partialUpdateOneArticle,
    removeArticle
}