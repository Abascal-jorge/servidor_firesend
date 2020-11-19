const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

exports.autenticarUsuario = async (req, res, next) => {
    
    //Validando datos
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        res.status(400).json({ errores: errores.array() });
    }
    //Revisar si hay errores

    //Buscar el usuario para ver si esta registrado 
    const { email, password } = req.body;
    const usuario = await Usuario.findOne( { email } );
    //console.log(usuario);

    if(!usuario){
        res.status(401).json({ msg: "El usuario no existe" } );
        return next();
    }

    //verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)){
        console.log("El password es correcto")
        //Crear json wbe token
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.SECRETA, {
            expiresIn: "8h"
        });
        res.json({ token });
    }else{
        res.status(401).json({msg: "password incorrecto"});
        return next();
    }
    //console.log("El usuario si existe");
}




exports.usuarioAutenticado = (req, res, next) => {
    
    res.json({ usuario: req.usuario });
    
}