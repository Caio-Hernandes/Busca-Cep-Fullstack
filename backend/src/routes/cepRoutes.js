const express = require('express');
const cepController = require('../controllers/cepController');

const router = express.Router();

router.get('/ceps', cepController.index);
router.post('/ceps', cepController.store);
router.delete('/ceps/:id', cepController.delete);

module.exports = router;