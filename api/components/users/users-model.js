const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model(process.env.USER_MODEL_NAME, userSchema, process.env.USER_COLLECTION_NAME);