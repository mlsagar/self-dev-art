const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String
    }
})

mongoose.model("Image", imageSchema, "images");