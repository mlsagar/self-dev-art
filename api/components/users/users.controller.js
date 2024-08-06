const mongoose = require("mongoose");
const User = mongoose.model(process.env.USER_MODEL_NAME);

const allUsers = function(request, response) {
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

    if (count > maxCount) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = `${process.env.MAX_LIMIT_MESSAGE} ${maxCount}`;
        _sendResponse(response, responseCollection);
        return;
    }    

    User.find().skip(offset).limit(count).exec()
        .then(_handleAllUsers.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const addUser = function(request, response) {
    
}

const _handleAllUsers = function(responseCollection, users) {
    if (!users) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.data = users;
    responseCollection.message = process.env.SUCCESS_FETCHING_MESSAGE;
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
    allUsers,
    addUser
}