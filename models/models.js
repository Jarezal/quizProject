var path = require('path');

//Postgres DATABASE_URL = postgress://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;


//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd, 
                        {dialect: dialect, 
                        protocol: protocol,
                        port: port,
                        host: host,
                        storage: storage, //solo SQLITE .env
                        omitNull: true //solo Postgress
                        });
                        
//Importar la definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar definición de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //Exportar definición tabla Quiz
exports.Comment = Comment; //Exportar definición tabla Comment
exports.sequelize =sequelize;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
    //success(...) ejecut el manejador una vez creada la tabla
    Quiz.count().success(function (count){
        if(count === 0){ //La tabla se inicializa solo si esta vacia
            Quiz.create({pregunta: 'Capital de Italia',
                        respuesta: 'Roma',
                        tema: 'Geografía'
            });
            Quiz.create({pregunta: 'Capital de Portugal',
                        respuesta: 'Lisboa',
                        tema: 'Geografía'
            })
        .then(function(){console.log('Base de datos inicializada')});
        };
    });
});