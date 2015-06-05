var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null, 
                        {dialect: "sqlite", storage: "quiz.sqlite"});
                        
//Importar la definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //Exportar definición tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
    //success(...) ejecut el manejador una vez creada la tabla
    Quiz.count().success(function (count){
        if(count === 0){ //La tabla se inicializa solo si esta vacia
            Quiz.create({pregunta: 'Capital de Italia',
                        respuesta: 'Roma'
            })
        .success(function(){console.log('Base de datos inicializada')});
        };
    });
});