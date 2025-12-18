const Quiz = require('../models/Quiz');

exports.index = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.render('home/index', { 
      title: 'Available Quizzes', 
      quizzes 
    });
  } catch (err) {
    console.error(err);
    res.render('errors/404', { title: 'Error', message: 'Could not load quizzes' });
  }
};

exports.takeQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).render('errors/404', { title: 'Quiz Not Found', message: 'Quiz not found' });
    }
    res.render('home/take', { 
      title: quiz.title, 
      quiz,
      layout: 'layouts/main' 
    });
  } catch (err) {
    console.error(err);
    res.status(404).render('errors/404', { title: 'Error', message: 'Quiz not found' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const userAnswers = req.body.answers || {};
    let score = 0;
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    const results = quiz.questions.map((q, index) => {
      
      const submittedAnswerIndex = parseInt(userAnswers[index]);
      const isCorrect = submittedAnswerIndex === q.correctAnswer;
      
      if (isCorrect) {
        score++;
        correctCount++;
      }

      return {
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
        submittedAnswerIndex: submittedAnswerIndex,
        isCorrect
      };
    });

    res.render('home/result', {
      title: 'Quiz Results',
      quiz,
      score,
      totalQuestions,
      correctCount,
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
