const express = require("express");
const { addUser, login } = require("./users-controller");

const router = express.Router();

router.route("/")
    .post(addUser)


router.route(process.env.ROUTE_LOGIN)
    .post(login)

module.exports = router;