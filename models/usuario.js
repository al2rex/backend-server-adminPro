var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLES'],
    message: '{VALUE} no es un rol permitido'
}


var usuarioSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, require: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, "la contraseña es necesaria"] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);