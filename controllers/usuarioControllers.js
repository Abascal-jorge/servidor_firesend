const { findOne } = require("../models/Usuario");
const Usuario = require("../models/Usuario")
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoUsuario = async (req, res) => {

    //Validando el schema
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    //Verificar si el usuario ya existe
    const { email, password } = req.body;
    
    let usuario = await Usuario.findOne( { email } );

    if(usuario){
        return res.status(400).json( { msg: "El usuario ya existe "});
    }

    //Crear un nuevo usuariio
    usuario = new Usuario(req.body);

    //Hasear el password 
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    try {
        await usuario.save();
        res.json({ msg: "usuario creado exitosamente"});   
    } catch (error) {
        console.log(error);
    }

}