const jwt = require("jsonwebtoken");

const authenticate = function(request, response, next) {
    const authorizationToken = request.headers["authorization"];

    // if (!authorizationToken) {
    //     return
    // }

    // const token = authorizationToken.split(" ")[1];
    
    // isJwtVerified = jwt.verify(token, "Self-Dev-Art")
    // if(!isJwtVerified) {
    //     response.send(Number(process.env.SERVER_ERROR_STATUS_CODE).json({
    //     }))
    //     return;
    // }
    next();
}

module.exports = authenticate