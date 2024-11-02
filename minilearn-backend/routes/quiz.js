const express = require('express');
const router = express.Router(); // Express Router'ı tanımla
const { getQuiz, generateQuiz } = require('../controllers/quizControllers'); // Controller fonksiyonunu al

// Quizleri getiren endpoint
router.post('/', generateQuiz);

module.exports = router; // Router'ı dışa aktar
