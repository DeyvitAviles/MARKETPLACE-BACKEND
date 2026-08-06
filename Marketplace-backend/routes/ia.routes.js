const express = require('express');
const router = express.Router();
const controller = require('../controllers/ia.controller');
const { autenticar } = require('../middlewares/auth');

router.post('/chat', autenticar, controller.chat);

module.exports = router;
