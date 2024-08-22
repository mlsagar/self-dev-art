const multer = require("multer");
const path = require("path");

const upload = function() {
    const storage = multer.diskStorage({
        destination: _declareDestinationOfImage,
        filename: _createImageName
    })
    return multer({storage});
}


const _declareDestinationOfImage = function(request, file, callback) {
    callback(null, path.join(__dirname + "/public/uploads"))
}

const _createImageName = function(request, file, callback) {
    callback(null, new Date().toISOString().replace(/:/g, '-') + "-" +file.originalname);
}
module.exports = { upload };