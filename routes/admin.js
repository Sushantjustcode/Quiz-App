const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const ensureAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
};

router.get('/login', adminController.login);
router.post('/login', adminController.auth);
router.get('/logout', adminController.logout);

router.get('/dashboard', ensureAuthenticated, adminController.dashboard);
router.get('/quizzes', ensureAuthenticated, adminController.getQuizzes);
router.get('/quizzes/create', ensureAuthenticated, adminController.createQuizForm);
router.post('/quizzes', ensureAuthenticated, adminController.createQuiz);

router.get('/quiz/:id/edit', ensureAuthenticated, adminController.editQuizForm);
router.post('/quiz/:id', ensureAuthenticated, adminController.updateQuiz);
router.post('/quiz/:id/delete', ensureAuthenticated, adminController.deleteQuiz);

router.post('/quiz/:id/question', ensureAuthenticated, adminController.addQuestion);
router.post('/quiz/:quizId/question/:questionId/delete', ensureAuthenticated, adminController.deleteQuestion);
router.get('/quiz/:quizId/question/:questionId', ensureAuthenticated, adminController.editQuestionForm);
router.post('/quiz/:quizId/question/:questionId', ensureAuthenticated, adminController.updateQuestion);

module.exports = router;
