const { sendHomeMessage } = require('../controllers/users.controller');
const router = require('express').Router();


router.get("/home", sendHomeMessage)

module.exports = router;