const jwt = require("jsonwebtoken");
const { allArticles } = require("../articles/articles-controller");

const authenticate = function(request, response, next) {
    const authorizationToken = request.headers[process.env.AUTHORIZATION];
    const responseCollection = _createResponseCollection();

    if (!authorizationToken) {
        // responseCollection.status = Number(process.env.UNAUTHORIZE_STATUS_CODE);
        // responseCollection.message = process.env.ACCESS_DENIED_MESSAGE
        // _sendResponse(response, responseCollection);

        const newRequest = {
            ...request,
            query: {
                count: parseInt(process.env.INITIAL_COUNT_OF_ARTICLE_WITHOUT_AUTHORIZATION, process.env.RADIX_VALUE)
            }
        }
        allArticles(newRequest, response);
        return
    }

    const token = authorizationToken.split(" ")[1];
    try {
        isJwtVerified = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    } catch(error) {
       _setInternalError(responseCollection, error)
       _sendResponse(response, responseCollection);
    } 
    next();
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

module.exports = authenticate