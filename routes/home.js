const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.index);
router.get('/quiz/:id', homeController.takeQuiz);
router.post('/quiz/:id/submit', homeController.submitQuiz);

module.exports = router;
