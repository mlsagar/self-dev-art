const express = require("express");
const singleImage = require("./uploads-controller");
const {upload} = require("../../../upload");
const router = express.Router({mergeParams: true});

router.route(process.env.ROUTE_IMAGE)
    .post(upload().single(process.env.FORM_DATA_IMAGE), singleImage)

module.exports = router;