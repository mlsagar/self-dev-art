const mongoose = require("mongoose");
const Image = mongoose.model("Image");
const fs = require("fs");
const path = require("path")

const singleImage = function (request, response) {
    // const imageUrl = `${request.protocol}://${request.get('host')}/uploads/${request.file.filename}`;
    const imageUrl = `/uploads/${request.file.filename}`;
    const newRequest = {
        url: imageUrl,
        filename: request.file.filename,
        image: {
            data: fs.readFileSync(path.join(__dirname + process.env.DIRECTORY_OF_UPLOAD_IMAGE + request.file.filename)),
            contentType: process.env.IMAGE_CONTENT_TYPE
        }
    }

    const responseCollection = _createResponseCollection();

    Image.create(newRequest)
        .then(_handleSingleImageSuccess.bind(null, responseCollection, imageUrl))
        .catch(_setInternalError.bind(null, responseCollection))
        .finally(_sendResponse.bind(null, response, responseCollection))
}

const _handleSingleImageSuccess = function(responseCollection, imageUrl, response) {
    if (!response) {
        responseCollection.status = Number(process.env.NOT_FOUND_STATUS_CODE);
        responseCollection.message = process.env.BAD_REQUEST_MESSAGE;
        return;
    }

    responseCollection.status = Number(process.env.SUCCESS_STATUS_CODE);
    responseCollection.data = [{url: imageUrl}]
    responseCollection.message = process.env.UPLOAD_IMAGE_SUCCESS_MESSAGE;
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

module.exports = singleImage;

