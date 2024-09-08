const express = require("express");

const router = express.Router();



router.get("/" , (req ,  res) => {
    console.log("send me the user req");
})


module.exports = router;

