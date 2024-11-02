const express = require('express');
const router = express.Router(); // Express Router'ı tanımla
const { getEvaluate, evaluate } = require('../controllers/evaluateController'); // Controller fonksiyonunu al

// Modülleri getiren endpoint
router.post('/', evaluate);

module.exports = router; // Router'ı dışa aktar
