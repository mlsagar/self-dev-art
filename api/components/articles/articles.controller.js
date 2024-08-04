const mongoose = require("mongoose");
const Article = mongoose.model(process.env.MODEL_NAME);
const callbackify = require("util").callbackify;

const allArticles = function (request, response) {
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

    Article.find().skip(offset).limit(count).exec()
        .then(_handleAllArticles.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const addArticle = function (request, response) {
    const newArticle = {
        title: request.body.title,
        author: request.body.author,
        link: request.body.link,
        comments: []
    }

    const responseCollection = _createResponseCollection();

    Article.create(newArticle)
        .then(_handleAddArticle.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}


const articleFinbByIdExec = function (articleId) {
    return Article.findById(articleId).exec();
}
const articleFindByIdExecWithCallbackify = callbackify(articleFinbByIdExec);

const handleOneArticle = function (response, error, article) {
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if (!article) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = { message: process.env.ARTICLE_ID_NOT_FOUND_MESSAGE }
    } else if (responseCollection.status === Number(process.env.CREATE_STATUS_CODE)) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE),
            responseCollection.message = article
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const oneArticle = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }

    articleFindByIdExecWithCallbackify(articleId, handleOneArticle.bind(null, response));
}

const articleSave = function (article) {
    return article.save();
}
const articleSaveWithCallbackify = callbackify(articleSave);

const _fullUpdateArticle = function (request, response, article, responseCollection) {
    article.title = request.body.title;
    article.author = request.body.author;
    article.link = request.body.link;

    articleSaveWithCallbackify(article, function (error) {
        if (error) {
            responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
            responseCollection.message = error;
        } else {
            responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
            responseCollection.message = { message: process.env.FULL_UPDATE_ARTICLE_SUCCESS_MESSAGE }
        }
        response.status(responseCollection.status).json(responseCollection.message);
    })
}

const _partialUpdateArticle = function(request, response, article, responseCollection) {
    if (request.body && request.body.title) { article.title = request.body.title }
        if (request.body && request.body.link) { article.link = request.body.link }
        if (request.body && request.body.author) { article.author = request.body.author }
        if (request.body && request.body.comments) { article.title = request.body.comments }


        articleSaveWithCallbackify(article, function (error) {
            if (error) {
                responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
                responseCollection.message = error;
            } else {
                responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
                responseCollection.message = { message: process.env.PARTIAL_UPDATE_ARTICLE_SUCCESS_MESSAGE }
            }
            response.status(responseCollection.status).json(responseCollection.message);
        })
}

const _updateArticle = function (request, response, updateArticleCallback, error, article) {
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if (!article) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = { message: process.env.INVALID_ARTICLE_ID_MESSAGE }
    }

    if (responseCollection.status !== Number(process.env.CREATE_STATUS_CODE)) {
        response.status(responseCollection.status).json(responseCollection.message);
    } else {
        updateArticleCallback(request, response, article, responseCollection);
    }

}

const fullUpdateOneArticle = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }

    articleFindByIdExecWithCallbackify(articleId, _updateArticle.bind(null, request, response, _fullUpdateArticle));
}

const partialUpdateOneArticle = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }

    articleFindByIdExecWithCallbackify(articleId, _updateArticle.bind(null, request, response, _partialUpdateArticle));
}


const articleFindByIdAndDeleteExec = function (articleId) {
    return Article.findByIdAndDelete(articleId).exec();
}
const articleFindByIdAndDeleteExecWithCallbackify = callbackify(articleFindByIdAndDeleteExec);
const handleRemoveArticle = function (response, error, deletedArticle) {
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if (!deletedArticle) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = { message: process.env.ARTICLE_ID_NOT_FOUND_MESSAGE };
    } else if (responseCollection.status === Number(process.env.CREATE_STATUS_CODE)) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = { message: process.env.DELETE_ARTICLE_MESSAGE};
    }
    response.status(responseCollection.status).json(responseCollection.message);
}
const article = function (request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }

    articleFindByIdAndDeleteExecWithCallbackify(articleId, handleRemoveArticle.bind(null, response));
}

const _handleAllArticles = function (responseCollection, articles) {
    if (!articles) {
        responseCollection.status = process.env.BAD_REQUEST_STATUS_CODE;
        responseCollection.message = {message: process.env.BAD_REQUEST_MESSAGE};
        return;
    }

    responseCollection.status = process.env.SUCCESS_STATUS_CODE;
    responseCollection.message = articles;
}

const _handleAddArticle = function(responseCollection, response) {
    if (!response) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = {message: process.env.BAD_REQUEST_MESSAGE};
        return;
    }

    responseCollection.status = process.env.SUCCESS_STATUS_CODE;
    responseCollection.message = {message: process.env.ARTICLE_POST_SUCCESS_MESSAGE};
}

const _createResponseCollection = function() {
    return {
        status: process.env.CREATE_STATUS_CODE,
        message: ""
    }
}

const _setInternalError = function(responseCollection, error) {
    responseCollection.status = process.env.SERVER_ERROR_STATUS_CODE;
    responseCollection.message = error;
}

const _sendResponse = function(response, responseCollection) {
    response.status(responseCollection.status).json(responseCollection.message)
}


module.exports = {
    allArticles,
    addArticle,
    oneArticle,
    fullUpdateOneArticle,
    partialUpdateOneArticle,
    article
}