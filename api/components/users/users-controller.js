const mongoose = require("mongoose");
const User = mongoose.model(process.env.USER_MODEL_NAME);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const allUsers = function (request, response) {
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

const addUser = function (request, response) {
    const responseCollection = _createResponseCollection();
    bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUND))
        .then(_generateHashPassword.bind(null, request))
        .then(_createNewUser.bind(null, request))
        .then(_userCreate)
        .then(_handleAddUser.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const login = function (request, response) {
    const responseCollection = _createResponseCollection();
    if (request.body && request.body.username && request.body.password) {
        User.find({ username: request.body.username })
            .then(_verifyPassword.bind(null, request))
            .catch(_setVerifyPasswordErrorStatusCode.bind(null, responseCollection))
            .then(_handleVerifyPassword.bind(null, responseCollection))
            .catch(_setInternalError.bind(null, responseCollection))
            .finally(_sendResponse.bind(null, response, responseCollection));
        return;
    }

    responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
    responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
    _sendResponse(response, responseCollection);
}

const oneUser = function (request, response) {
    const userId = request.params.userId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(userId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.INVALID_USER_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }

    User.findById(userId).exec()
        .then(_handleOneUser.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const fullUpdateOneUser = function (request, response) {
    const userId = request.params.userId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(userId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.INVALID_USER_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }
    User.findById(userId).exec()
        .then(_updateUser.bind(null, request, responseCollection, _fullUpdateUser))
        .then(_handleUpdateResponse.bind(null, process.env.FULL_UPDATE_USER_SUCCESS_MESSAGE, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const partialUpdateOneUser = function (request, response) {
    const userId = request.params.userId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(userId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.INVALID_USER_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }
    User.findById(userId).exec()
        .then(_updateUser.bind(null, request, responseCollection, _partialUpdateUser))
        .then(_handleUpdateResponse.bind(null, process.env.PARTIAL_UPDATE_USER_SUCCESS_MESSAGE, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const removeUser = function (request, response) {
    const userId = request.params.userId;
    const responseCollection = _createResponseCollection();
    if (!mongoose.isValidObjectId(userId)) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.INVALID_USER_ID_MESSAGE;
        _sendResponse(response, responseCollection);
        return;
    }

    User.findByIdAndDelete(userId).exec()
        .then(_handleRemoveUser.bind(null, responseCollection))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection));
}

const _handleAllUsers = function (responseCollection, users) {
    if (!users) {
        responseCollection.status = Number(process.env.BAD_REQUEST_STATUS_CODE);
        responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.data = users;
    responseCollection.message = process.env.SUCCESS_FETCHING_MESSAGE;
}

const _handleAddUser = function (responseCollection, response) {
    if (!response) {
        responseCollection.status = Number(process.env.SERVER_ERROR_STATUS_CODE);
        responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = process.env.USER_POST_SUCCESS_MESSAGE;
}

const _generateHashPassword = function (request, salt) {
    return bcrypt.hash(request.body.password, salt);
}

const _createNewUser = function (request, hashPassword) {
    return new Promise((resolve, reject) => {
        if (hashPassword) {
            const newUser = {
                name: request.body.name,
                username: request.body.username,
                password: hashPassword
            }
            resolve(newUser);
            return;
        }

        reject("Not able to create new user");

    })
}

const _userCreate = function (newUser) {
    return User.create(newUser)
}

const _handleOneUser = function (responseCollection, user) {
    if (!user) {
        _setResponseCollectionForAbsenceOfUser(responseCollection);
        return;
    }
    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE),
        responseCollection.data = [user];
    responseCollection.message = process.env.SUCCESS_FETCHING_MESSAGE;
}

const _updateUser = function (request, responseCollection, updateUserCallback, user) {
    if (!user) {
        _setResponseCollectionForAbsenceOfUser(responseCollection);
        return;
    }

    updateUserCallback(request, user);
    return user.save()

}

const _handleUpdateResponse = function (message, responseCollection, saveResponse) {
    if (saveResponse) {
        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = message;
    }
}

const _fullUpdateUser = function (request, user) {
    user.name = request.body.name;
    user.password = request.body.password;
    user.username = request.body.username;
}

const _partialUpdateUser = function (request, user) {
    if (request.body && request.body.name) { user.name = request.body.name }
    if (request.body && request.body.username) { user.username = request.body.username }
    if (request.body && request.body.password) { user.password = request.body.password }
}

const _handleRemoveUser = function (responseCollection, deletedUser) {
    if (!deletedUser) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = process.env.USER_ID_NOT_FOUND_MESSAGE;
        return;
    }
    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.message = process.env.DELETE_USER_MESSAGE;

}

const _setResponseCollectionForAbsenceOfUser = function (responseCollection) {
    responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
    responseCollection.message = process.env.USER_ID_NOT_FOUND_MESSAGE;
}

const _verifyPassword = function(request, databaseUser) {
    return new Promise((resolve, reject) => {
        if (!databaseUser.length) {
            reject(process.env.UNAUTHORIZE_USER_MESSAGE)
            return;
        }
        resolve(bcrypt.compare(request.body.password, databaseUser[0].password));
    })

}

const _setVerifyPasswordErrorStatusCode = function(responseCollection, error) {
    responseCollection.status = Number(process.env.UNAUTHORIZE_STATUS_CODE);
    throw error;
}

const _handleVerifyPassword = function(responseCollection, isVerified) {
        if (!isVerified) {
            responseCollection.status = Number(process.env.UNAUTHORIZE_STATUS_CODE);
            responseCollection.message = process.env.UNAUTHORIZE_USER_MESSAGE;
            return;
        }

        responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
        responseCollection.message = process.env.LOGIN_SUCCESS_MESSAGE;
        responseCollection.token = jwt.sign("You are welcome", "Self-Dev-Art");
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
    addUser,
    oneUser,
    fullUpdateOneUser,
    partialUpdateOneUser,
    removeUser,
    login
}