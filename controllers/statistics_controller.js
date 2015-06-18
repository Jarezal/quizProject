var models = require('../models/models.js');

exports.statistics = function(req,res){
    
    var statistics ={countPreguntas: 0, countComentarios: 0, mediaComentarios: 0, pregComm: 0, pregNoComm:0};
    
    models.sequelize.query('SELECT count(*) AS preguntas FROM "Quizzes"').then(function(countPreguntas){
        statistics.countPreguntas = countPreguntas[0].preguntas;
        models.sequelize.query('SELECT count(*) AS comentarios FROM "Comments"').then(function(countComentarios){
            statistics.countComentarios = countComentarios[0].comentarios;
            if(statistics.countPreguntas >0)
            {
                statistics.mediaComentarios = statistics.countComentarios / statistics.countPreguntas;
            }
            models.sequelize.query('SELECT count(*) AS pregComm FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")').then(function(countPregComm)
            {
                statistics.pregComm = countPregComm[0].pregComm;
                statistics.pregNoComm = statistics.countPreguntas - statistics.pregComm;
                res.render('quizes/statistics.ejs',{statistics: statistics, errors:[]})
            })
        })
        
    })
    
}