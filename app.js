
require("dotenv").config();
require("./data/dbconnection");

const express = require("express");
const path = require("path");

const port = process.env.PORT;
const application = express();

application.use(express.static(path.join(__dirname, "public")));


application.listen(port, console.log(`Listening at ${port}`))