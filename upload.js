const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const upload = function() {
    const storage = new GridFsStorage({
        url: process.env.DATABASE_URL,
        file: (request, file) => {
            return new Promise((resolve, reject) => {
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: process.env.IMAGE_BUCKET,
                }
                resolve(fileInfo);
            })
        }
    })

    return multer({storage});
}


module.exports = { upload };