const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const callbackify = require("util").callbackify;

const handleMongooseConnectionCloseCallbackify = function() {
    return mongoose.connection.close();
}

const mongooseConnectionCloseWithCallbackify = callbackify(handleMongooseConnectionCloseCallbackify);

const handleConnected = function() {
    console.log("Mongoose connected to " + process.env.DATABASE_NAME);
}

const handleDisconnected = function(){
    console.log("Mongoose disconnected");
}

const handleError = function(error) {
    console.log("Mongoose error: " + error);
}

mongoose.connection.on("connected", handleConnected);

mongoose.connection.on("disconnected", handleDisconnected);

mongoose.connection.on("error", handleError);

const handleMongooseConnectionClose = function(processSignalType) {
    console.log(process.env[processSignalType + "_MESSAGE"]);
    if (processSignalType === "SIGUSR2") {
        process.kill(process.pid, "SIGUSR2");
        return;
    }
    process.exit(0);
}

const handleSIGINT = function() {
    mongooseConnectionCloseWithCallbackify(handleMongooseConnectionClose.bind(null, "SIGINT"));
}
const handleSIGTERM = function() {
    mongooseConnectionCloseWithCallbackify(handleMongooseConnectionClose.bind(null, "SIGTERM"));
}
const handleSIGUSR2 = function() {
    mongooseConnectionCloseWithCallbackify(handleMongooseConnectionClose.bind(null, "SIGUSR2"));
}

process.on("SIGINT", handleSIGINT);
process.on("SIGTERM", handleSIGTERM);
process.on("SIGUSR2", handleSIGUSR2);