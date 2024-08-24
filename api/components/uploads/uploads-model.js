const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String,
    image: {
        data: Buffer,
        contentType: String
    }
})

mongoose.model("Image", imageSchema, "images");