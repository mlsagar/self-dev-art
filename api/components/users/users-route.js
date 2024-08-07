const express = require("express");
const { allUsers, addUser, oneUser, fullUpdateOneUser, partialUpdateOneUser, removeUser, login } = require("./users.controller");

const router = express.Router();

router.route("/")
    .get(allUsers)
    .post(addUser)

router.route(process.env.ROUTE_WITH_USER_ID)
    .get(oneUser)
    .put(fullUpdateOneUser)
    .patch(partialUpdateOneUser)
    .delete(removeUser);

router.route(process.env.ROUTE_LOGIN)
    .post(login)

module.exports = router;