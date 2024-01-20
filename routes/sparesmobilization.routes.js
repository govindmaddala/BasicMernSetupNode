const { sparesmobilizationData, authentication, sendData } = require('../controllers/sparesmobilization.controller');

const router = require('express').Router();

router.get("/",sparesmobilizationData)
router.post("/sendData", authentication,sendData)

module.exports = router;