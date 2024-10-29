const express = require('express');
const router = express.Router(); // Express Router'ı tanımla
const { getModules, generateModule } = require('../controllers/modulesController'); // Controller fonksiyonunu al

// Modülleri getiren endpoint
router.post('/', generateModule);

module.exports = router; // Router'ı dışa aktar
