const mongoose = require("mongoose");
const Article = mongoose.model(process.env.ARTICLE_MODEL);
const callbackify = require("util").callbackify;


const articleFindSkipLimitExec = function(offset, count){
    return Article.find().skip(offset).limit(count).exec();
}
const articleFindSkipLimitExecWithCallbackify = callbackify(articleFindSkipLimitExec);
const handleAllArticles = function(response, error, articles) {
    const responseCollection = {
        status: Number(process.env.SUCCESS_STATUS_CODE),
        message: articles
    }
    if (error) { 
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE),
        responseCollection.message = error
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const allArticles = function(request, response) {
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
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: "Invalid offset or count" });
        return;
    }

    if (count > maxCount) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({message: "Cannot exceed count of " + maxCount});
        return;
    }

    articleFindSkipLimitExecWithCallbackify(offset, count, handleAllArticles.bind(null, response));
}


const articleCreate = function(article) {
    return Article.create(article);
}
const articleCreateWithCallbackify = callbackify(articleCreate);
const handleAddArticle = function(response, error) {
    const responseCollection = {
       status: Number(process.env.SUCCESS_STATUS_CODE),
       message: {message: "Posted article successfully"}
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } 

    response.status(responseCollection.status).json(responseCollection.message);
}
const addArticle = function(request, response) {
    const newArticle = {
        title: request.body.title,
        author: request.body.author,
        link: request.body.link,
        comments: []
    }

    articleCreateWithCallbackify(newArticle, handleAddArticle.bind(null, response));
}


const articleFinbByIdExec = function(articleId) {
    return Article.findById(articleId).exec();
}
const articleFindByIdExecWithCallbackify = callbackify(articleFinbByIdExec);

const handleOneArticle = function(response, error, article) {
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if(!article) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = {message: "Article ID not found"}
    } else if (responseCollection.status === Number(process.env.CREATE_STATUS_CODE)) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE),
        responseCollection.message = article
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const oneArticle = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: "Invalid article id" });
        return;
    }

    articleFindByIdExecWithCallbackify(articleId, handleOneArticle.bind(null, response));    
}

const articleSave = function(article) {
    return article.save();
}
const articleSaveWithCallbackify = callbackify(articleSave);

const handleFullUpdateOneArticle = function(request, response, error, article) {     
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if(!article) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = {message: process.env.INVALID_ARTICLE_ID_MESSAGE}
    }

    if (responseCollection.status === Number(process.env.CREATE_STATUS_CODE)) {
        article.title = request.body.title;
        article.author = request.body.author;
        article.link = request.body.link;

        articleSaveWithCallbackify(article, function(error) {
            if(error) {
                responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
                responseCollection.message = error;
            } else {
                responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
                responseCollection.message = {message: "Updated Article Fully!!!"}
            }
            response.status(responseCollection.status).json(responseCollection.message);
        })
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }

}
const fullUpdateOneArticle = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }    

    articleFindByIdExecWithCallbackify(articleId, handleFullUpdateOneArticle.bind(null, request, response));
}


const handlePartialUpdateOneArticle = function(request, response, error, article) {     
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if(!article) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = {message: process.env.INVALID_ARTICLE_ID_MESSAGE}
    }

    if (responseCollection.status === Number(process.env.CREATE_STATUS_CODE)) {
        if (request.body && request.body.title) {article.title = request.body.title}
        if (request.body && request.body.link) {article.link = request.body.link}
        if (request.body && request.body.author) {article.author = request.body.author}
        if (request.body && request.body.comments) {article.title = request.body.comments}
        

        articleSaveWithCallbackify(article, function(error) {
            if(error) {
                responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
                responseCollection.message = error;
            } else {
                responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
                responseCollection.message = {message: "Updated Article Partially!!!"}
            }
            response.status(responseCollection.status).json(responseCollection.message);
        })
    } else {
        response.status(responseCollection.status).json(responseCollection.message);
    }
}
const partialUpdateOneArticle = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    } 

    articleFindByIdExecWithCallbackify(articleId,  handlePartialUpdateOneArticle.bind(null, request, response));
}


const articleFindByIdAndDeleteExec = function(articleId) {
    return Article.findByIdAndDelete(articleId).exec();
}
const articleFindByIdAndDeleteExecWithCallbackify = callbackify(articleFindByIdAndDeleteExec);
const handleRemoveArticle = function(response, error, deletedArticle) {
    const responseCollection = {
        status: Number(process.env.CREATE_STATUS_CODE),
        message: ""
    }
    if (error) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = error;
    } else if(!deletedArticle) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = {message: "Article ID not found"};
    } else if (responseCollection.status === Number(process.env.CREATE_STATUS_CODE)) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = {message: "Deleted Article Successfully"};
    }
    response.status(responseCollection.status).json(responseCollection.message);
}
const article = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(Number(process.env.BAD_REQUEST_STATUS_CODE)).json({ message: process.env.INVALID_ARTICLE_ID_MESSAGE });
        return;
    }

    articleFindByIdAndDeleteExecWithCallbackify(articleId, handleRemoveArticle.bind(null, response));
}


module.exports = {
    allArticles,
    addArticle,
    oneArticle,
    fullUpdateOneArticle,
    partialUpdateOneArticle,
    article
}