const express = require("express");
const { allUsers, addUser } = require("./users.controller");

const router = express.Router();

router.route("/")
    .get(allUsers)
    .post(addUser)

module.exports = router;