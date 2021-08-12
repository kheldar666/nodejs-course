const express = require('express');

const errorsController = require('../controllers/errors')

const router = express.Router();

router.get("/500", errorsController.get500Error);

router.use('/', errorsController.get404Error);

module.exports = router;