var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);

//Definicion de rutas de sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

//Definicion de rutas
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/author', quizController.author);
router.get('/quizes/new',sessionController.loginRequied, quizController.new);
router.post('/quizes/create', sessionController.loginRequied, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequied, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequied, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequied, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
