//Require
var express = require("express");
var mongoose = require('mongoose');


//importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var bodyParser = require('body-parser')
var loginRoutes = require('./routes/login');

//Inicializar variables
var app = express();



//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online')
});


//rutas
app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes)
app.use('/', appRoutes);


//Escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', ' online')
});