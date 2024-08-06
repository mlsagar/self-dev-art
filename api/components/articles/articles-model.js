const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comments: [commentSchema]
})

mongoose.model(process.env.ARTICLE_MODEL_NAME, articleSchema, process.env.ARTICLE_COLLECTION_NAME);