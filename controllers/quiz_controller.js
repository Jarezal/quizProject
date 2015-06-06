var models = require('../models/models.js');

//AUtoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
        models.Quiz.find(quizId).then(
            function(quiz) {
                if(quiz) {
                    req.quiz = quiz;
                    next();
                }else { next(new Error('No existe quizId =' + quizId));
            }}).catch(function(error) {next(error);});
};


//GET /quizes
exports.index = function(req,res){
        //Se añade filtro. Al ser una BD pequeña hacemos el like % cuando no venga el filtro por simplificar el código.
        var filtro = req.query.search || ""
        filtro = "%" + filtro.trim().toUpperCase().replace(/ /g,"%") + "%";
        models.Quiz.findAll({where:["upper(pregunta) like ?",filtro], order:['pregunta']}).then(function(quizes){
            res.render('quizes/index', {quizes: quizes});
        }).catch(function(error) {next(error);}); 
};

//GET /quizes/:id
exports.show = function(req,res){
        res.render('quizes/show',{quiz: req.quiz});
};

//GET /quizes/answer

exports.answer = function(req,res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase())
    {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
    
};

exports.author = function(req,res) {
        res.render('quizes/author');  
};