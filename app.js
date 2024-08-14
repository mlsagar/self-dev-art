
require("dotenv").config();
require("./api/db/dbconnection");

const express = require("express");
const path = require("path");

const routes = require("./api/routes");

const port = process.env.PORT;
const application = express();

const _setHeaderOfRoute = function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    response.setHeader("Access-Control-Allow-Methods", "PUT, PATCH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
    next()
}

application.use(express.static(path.join(__dirname, "public")));

application.use(express.json());
application.use(express.urlencoded({extended: true}));

application.use(process.env.ROUTE_API, _setHeaderOfRoute);

application.use(process.env.ROUTE_API, routes);

application.listen(port, console.log(`Listening at ${port}`))

