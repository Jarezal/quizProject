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
            res.render('quizes/index', {quizes: quizes, errors: []});
        }).catch(function(error) {next(error);}); 
};

//GET /quizes/:id
exports.show = function(req,res){
        res.render('quizes/show',{quiz: req.quiz, errors: []});
};

//GET /quizes/answer

exports.answer = function(req,res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase())
    {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
    
};

//GET /quizes/author
exports.author = function(req,res) {
        res.render('quizes/author');  
};

//GET /quizes/new
exports.new = function(req,res){
    var quiz = models.Quiz.build( //crea objeto quiz
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );
    
    res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req,res){
    var quiz = models.Quiz.build(req.body.quiz);
    
    var errores = quiz.validate();
    
    if(errores)
    {
        //necesario convertir el objeto errores a un array con propiedad message para que el layout lo muestre
        var i = 0;
        var erroresArray=new Array();
        for (var j in errores) erroresArray[i++]={message: errores[j]}; 
        res.render('quizes/new', {quiz: quiz, errors: erroresArray});
    }
    else
    {
        //guarda en DB los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
        res.redirect('/quizes');
    })} //Redireccion HTTP (URL relativo) lista de preguntas
    
};

//GET /quizes/:id/edit
exports.edit = function(req,res){
    var quiz = req.quiz; //autoload de instancia de quiz
    res.render('quizes/edit',{quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    
    var errores = req.quiz.validate();
    
    if(errores)
    {
        //necesario convertir el objeto errores a un array con propiedad message para que el layout lo muestre
        var i = 0;
        var erroresArray=new Array();
        for (var j in errores) erroresArray[i++]={message: errores[j]}; 
        res.render('quizes/edit', {quiz: req.quiz, errors: erroresArray});
    }
    else
    {
        //guarda en DB los campos pregunta y respuesta de quiz
        req.quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
        res.redirect('/quizes');
    })} //Redireccion HTTP (URL relativo) lista de preguntas
};

//DELETE /quizes/:id
exports.destroy = function(req,res){
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};