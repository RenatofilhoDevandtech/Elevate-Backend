const express = require('express');
const router = express.Router();
const subscribeController = require('../controllers/subscribeController');

// Define a rota pública para registrar o interesse em uma nova funcionalidade.
// O frontend fará uma chamada POST para /api/subscribe/feature-update
router.post('/feature-update', subscribeController.addFeatureSubscriber);

module.exports = router;