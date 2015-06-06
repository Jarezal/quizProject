var models = require('../models/models.js');

//GET /quizes
exports.index = function(req,res){
        models.Quiz.findAll().then(function(quizes){
            res.render('quizes/index.ejs', {quizes: quizes});
        })  
};

//GET /quizes/:id
exports.show = function(req,res){
        models.Quiz.find(req.params.quizId).then(function(quiz){
            res.render('quizes/show',{quiz: quiz});
        })
          
};

//GET /quizes/answer

exports.answer = function(req,res) {
    models.Quiz.find(req.params.quizId).then(function(quiz){
    if (req.query.respuesta.toUpperCase() === quiz.respuesta.toUpperCase())
    {
        res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
    }
    else
    {
        res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
    }
    })
};

exports.author = function(req,res) {
        res.render('quizes/author');  
};