//Require
var express = require("express");
var mongoose = require('mongoose');


//importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var bodyParser = require('body-parser')
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
//Inicializar variables
var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
});


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
//Server index config
/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/




//rutas
app.use('/usuario', usuariosRoutes);
app.use('/hospital', hospitalRoutes)
app.use('/medico', medicoRoutes)
app.use('/login', loginRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/upload', uploadRoutes)
app.use('/img', imagenesRoutes)
app.use('/', appRoutes);


//Escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', ' online')
});