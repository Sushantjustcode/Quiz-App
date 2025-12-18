const Quiz = require('../models/Quiz');

exports.login = (req, res) => {
  res.render('auth/login', { title: 'Admin Login', layout: 'layouts/main' });
};

exports.auth = (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.user = { username };
    req.flash('success', 'Logged in successfully');
    res.redirect('/admin/dashboard');
  } else {
    req.flash('error', 'Invalid credentials');
    res.redirect('/admin/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.dashboard = async (req, res) => {
  try {
    const quizCount = await Quiz.countDocuments();
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard', 
      quizCount 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/login');
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.render('admin/quizzes', { 
      title: 'Manage Quizzes', 
      quizzes 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
};

exports.createQuizForm = (req, res) => {
  res.render('admin/createQuiz', { title: 'Create Quiz' });
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newQuiz = new Quiz({ title, description, questions: [] });
    await newQuiz.save();
    req.flash('success', 'Quiz created successfully');
    res.redirect(`/admin/quiz/${newQuiz._id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating quiz');
    res.redirect('/admin/quizzes/create');
  }
};

exports.editQuizForm = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.redirect('/admin/quizzes');
    res.render('admin/editQuiz', { title: 'Edit Quiz', quiz });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/quizzes');
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    await Quiz.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success', 'Quiz updated successfully');
    res.redirect('/admin/quizzes');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating quiz');
    res.redirect(`/admin/quiz/${req.params.id}/edit`);
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    req.flash('success', 'Quiz deleted successfully');
    res.redirect('/admin/quizzes');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting quiz');
    res.redirect('/admin/quizzes');
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const { questionText, options, correctAnswer } = req.body;
    
    quiz.questions.push({
      questionText,
      options,
      correctAnswer: parseInt(correctAnswer)
    });
    
    await quiz.save();
    req.flash('success', 'Question added');
    res.redirect(`/admin/quiz/${req.params.id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error adding question');
    res.redirect(`/admin/quiz/${req.params.id}/edit`);
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    await Quiz.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } }
    );
    req.flash('success', 'Question deleted');
    res.redirect(`/admin/quiz/${quizId}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting question');
    res.redirect(`/admin/quiz/${req.params.quizId}/edit`);
  }
};

exports.editQuestionForm = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const quiz = await Quiz.findById(quizId);
    const question = quiz.questions.id(questionId);
    
    if (!question) return res.redirect(`/admin/quiz/${quizId}/edit`);
    
    res.render('admin/editQuestion', { 
      title: 'Edit Question', 
      quizId, 
      question 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/quizzes');
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { questionText, options, correctAnswer } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    const question = quiz.questions.id(questionId);
    
    question.questionText = questionText;
    question.options = options;
    question.correctAnswer = parseInt(correctAnswer);
    
    await quiz.save();
    
    req.flash('success', 'Question updated');
    res.redirect(`/admin/quiz/${quizId}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating question');
    res.redirect(`/admin/quiz/${req.params.quizId}/question/${req.params.questionId}`);
  }
};
