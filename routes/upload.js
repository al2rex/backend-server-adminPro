var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs')

var app = express();

var Usuario = require("../models/usuario")
var Medico = require("../models/medico")
var Hospital = require("../models/hospital")

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    //Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            error: { message: 'Tipo de coleccion no es valida: ' + tiposValidos.join(',') }
        });
    }



    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            error: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split(".");
    var extension = nombreCortado[nombreCortado.length - 1];

    //solo estas extensiones aceptamos
    var extensionValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG']

    if (extensionValidas.indexOf(extension) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'extension no valida',
            error: { message: 'Las extensiones validas son: ' + extensionValidas.join(',') }
        });
    }
    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extension}`;

    //mover archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`

    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover',
                error: err
            });
        }

        subirPortTipo(tipo, id, nombreArchivo, res);
    })


    /*res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente',
        nombreCortado: extension
    });*/

});

function subirPortTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'usuario no existe' }
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;
            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = 'c:';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            })


        })


    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'medico no existe' }
                });
            }
            var pathViejo = './uploads/medicos/' + usuario.img;
            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            })


        })

    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            })


        })
    }

}
module.exports = app;