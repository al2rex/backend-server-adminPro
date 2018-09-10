var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();
// Google
const { OAuth2Client } = require('google-auth-library');
var CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

var Usuario = require('../models/usuario');

// ============================================
// AUTHENTICACION DE GOOGLE
// ============================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'] //;
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        payload: payload
    }
}
app.post('/google', async(req, res, next) => {
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido',
            });
        })

    Usuario.findOne({ email: googleUser.email }, (err, UsuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al bucar usuario',
                googleUser: googleUser
            });
        }
        if (UsuarioBD) {
            if (UsuarioBD.google === false) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Debe de usar su atenticacion normal',
                });
            } else {
                var token = jwt.sign({ usuario: UsuarioBD }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    usuario: UsuarioBD,
                    token: token,
                    id: UsuarioBD._id
                });
            }
        } else {
            //El usuario no existe ... hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.role = 'USER_ROLES'
            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioGuardado }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado,
                    token: token,
                    id: usuarioGuardado._id
                });
            });
        }
    })
})

app.post('/', (req, res, next) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, UsuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!UsuarioBD) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -- email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, UsuarioBD.password)) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -- password',
                errors: err
            });
        }

        //CREAR TOKEN
        UsuarioBD.password = ':)';
        var token = jwt.sign({ usuario: UsuarioBD }, SEED, { expiresIn: 14400 });

        return res.status(200).json({
            ok: true,
            usuario: UsuarioBD,
            token: token,
            id: UsuarioBD._id
        });
    })



})


module.exports = app