const mongoose = require("mongoose");
const User = mongoose.model(process.env.USER_MODEL_NAME);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    addUser,
    login
}