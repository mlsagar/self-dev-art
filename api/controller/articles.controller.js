const mongoose = require("mongoose");
const { compileFunction } = require("vm");
const Article = mongoose.model(process.env.ARTICLE_MODEL);
const callbackify = require("util").callbackify;


const handleArticleFindSkipLimitExecCallbackify = function(offset, count){
    return Article.find().skip(offset).limit(count).exec();
}
const articleFindSkipLimitExecWithCallbackify = callbackify(handleArticleFindSkipLimitExecCallbackify);
const handleAllArticles = function(response, error, articles) {
    const responseCollection = {
        status: 200,
        message: articles
    }
    if (error) {
        responseCollection.status = 500,
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
        response.status(400).json({ message: "Invalid offset or count" });
        return;
    }

    if (count > maxCount) {
        response.status(400).json({message: "Cannot exceed count of " + maxCount});
        return;
    }

    articleFindSkipLimitExecWithCallbackify(offset, count, handleAllArticles.bind(null, response));
}


const handleArticleCreateWithCallbackify = function(article) {
    return Article.create(article);
}
const articleCreateWithCallbackify = callbackify(handleArticleCreateWithCallbackify);
const handleAddArticle = function(response, error) {
    const responseCollection = {
        status: 200,
        message: {message: "Post article successfully!!!"}
    }
    if (error) {
        responseCollection.status = 500;
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


const handleArticleFindByIdExecCallbackify = function(articleId) {
    return Article.findById(articleId).exec();
}
const articleFindByIdExecWithCallbackify = callbackify(handleArticleFindByIdExecCallbackify);
const handleOneArticle = function(response, error, article) {
    const responseCollection = {
        status: 200,
        message: article
    }
    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    } else if(!article) {
        responseCollection.status = 404;
        responseCollection.message = {message: "Article ID not found"}
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const oneArticle = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }

    articleFindByIdExecWithCallbackify(articleId, handleOneArticle.bind(null, response));    
}


const handleArticleFindByIdAndUpdateExecCallbackify = function(articleId, article) {
    return Article.findByIdAndUpdate(articleId, article).exec();
}
const articleFindByIdAndUpdateExecWithCallbackify = callbackify(handleArticleFindByIdAndUpdateExecCallbackify);
const handleFullUpdateOneArticle = function(response, error) {
    const responseCollection = {
        status: 200,
        message: {message: "Updated successfully"}
    }
    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    }

    response.status(responseCollection.status).json(responseCollection.message);
}
const fullUpdateOneArticle = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }
    
    const updatedArticle = {
        title: request.body.title,
        author: request.body.author,
        link: request.body.link,
        comments: request.body.comments
    }

    articleFindByIdAndUpdateExecWithCallbackify(articleId, updatedArticle, handleFullUpdateOneArticle.bind(null, response));
}


const partialUpdateOneArticle = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    } 

    articleFindByIdAndUpdateExecWithCallbackify(articleId, request.body, handleFullUpdateOneArticle.bind(null, response));
}


const handleArticleFindByIdAndDeleteExecCallbackify = function(articleId) {
    return Article.findByIdAndDelete(articleId).exec();
}
const articleFindByIdAndDeleteExecWithCallbackify = callbackify(handleArticleFindByIdAndDeleteExecCallbackify);
const handleArticle = function(response, error, deletedArticle) {
    const responseCollection = {
        status: 200,
        message: {message: "Deleted article successfully!!!"}
    }
    if (error) {
        responseCollection.status = 500;
        responseCollection.message = error;
    } else if(!deletedArticle) {
        responseCollection.status = 404;
        responseCollection.message = {message: "Article ID not found"}
    }
    response.status(responseCollection.status).json(responseCollection.message);
}
const article = function(request, response) {
    const articleId = request.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        response.status(400).json({ message: "Invalid article id" });
    }

    articleFindByIdAndDeleteExecWithCallbackify(articleId, handleArticle.bind(null, response));
}


module.exports = {
    allArticles,
    addArticle,
    oneArticle,
    fullUpdateOneArticle,
    partialUpdateOneArticle,
    article
}