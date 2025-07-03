const express = require('express');
const cepController = require('../controllers/cepController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

//rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

//rotas protegidas
router.get('/ceps', authMiddleware, cepController.index);
router.post('/ceps',authMiddleware, cepController.store);
router.delete('/ceps/:id', authMiddleware,cepController.delete);

module.exports = router;