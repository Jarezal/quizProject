var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
exports.new = function(req,res){
    res.render('comments/new.ejs',{quizid: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req,res){
    var comment = models.Comment.build(
        {texto: req.body.comment.texto,
         QuizId: req.params.quizId
        });
        
    var errores = comment.validate();
    if(errores)
    {
        //necesario convertir el objeto errores a un array con propiedad message para que el layout lo muestre
        var i = 0;
        var erroresArray=new Array();
        for (var j in errores) erroresArray[i++]={message: errores[j]};
        res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: erroresArray});
    }
    else
    {
        comment.save().then(function(){res.redirect('/quizes/'+req.params.quizId)});
    }   //res.redirect: Redireccion HTTP a lista de preguntas   
}
