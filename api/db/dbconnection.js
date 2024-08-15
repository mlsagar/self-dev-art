require("../components/articles/articles-model");
require("../components/users/users-model");
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);

const handleConnected = function() {
    console.log( `${process.env.MONGOOSE_CONNECTED_MESSAGE} ${process.env.DATABASE_NAME}`);
}

const handleDisconnected = function(){
    console.log(process.env.MONGOOSE_DISCONNECTED_MESSAGE);
}

const handleError = function(error) {
    console.log(`${process.env.MONGOOSE_ERROR_MESSAGE} ${error}`);
}

mongoose.connection.on(process.env.MONGOOSE_CONNECTED, handleConnected);

mongoose.connection.on(process.env.MONGOOSE_DISCONNECTED, handleDisconnected);

mongoose.connection.on(process.env.MONGOOSE_ERROR, handleError);


const handleSIGINT = function() {
    mongoose.connection.close().then(_handleProcessSignal.bind(null, process.env.SIGNAL_INTERRUPTION));
}
const handleSIGTERM = function() {    
    mongoose.connection.close().then(_handleProcessSignal.bind(null, process.env.SIGNAL_TERMINATION));
}
const handleSIGUSR2 = function() {
    mongoose.connection.close().then(_handleProcessSignal.bind(null, process.env.SIGNAL_RESTART));
}

process.on(process.env.SIGNAL_INTERRUPTION, handleSIGINT);
process.on(process.env.SIGNAL_TERMINATION, handleSIGTERM);
process.on(process.env.SIGNAL_RESTART, handleSIGUSR2);

const _handleProcessSignal = function(processSignalType) {
    console.log(process.env[processSignalType + "_MESSAGE"]);
    if (processSignalType === process.env.SIGNAL_RESTART) {
        process.kill(process.pid, processSignalType);
        return;
    }
    process.exit(0);
}