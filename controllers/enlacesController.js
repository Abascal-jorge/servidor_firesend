const Enlaces = require("../models/Enlaces");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res,next) => {
   
    //Reisar si hay errores
    //console.log(req.body);
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }
    //Crear un objeto
    const { nombre_original, password } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;
    enlace.password = password;

    //Si el usuario esta autenticdo
    if(req.usuario){
        const { password, descargas } = req.body;

        //Asignar a enlace el numero de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        //Asignar un password
        if(password){
            const salt = bcrypt.genSaltSync(10);
            enlace.password = await bcrypt.hashSync(password, salt);
        }

        enlace.autor = req.usuario.id;
    }
    //Almacenar en la BD
    try {
        await enlace.save();
        res.json({msg: `${enlace.url}`});
        return next();
    } catch (error) {
        console.log(error);
    }
}

//npm i shortid

//Obtener el enlace 
exports.ontenerEnlace = async (req, res, next ) => {
    //console.log(req.params.url);

    //Verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url: req.params.url });
    if(!enlace){
        res.status(404).json({msg: "ese enlace no existe"});
        return next();
    }
    //console.log(enlace);

    //Si el enlace existe+
    res.json({archivo: enlace.nombre});

    //sI LAS DESCARGAR SON IGUALES A 1 BORRAR LA ENTRADA Y BORRAR EL ARCHIVO
    const { descargas, nombre } = enlace;
    if(descargas === 1 ){
        //eLIMINAR EL ARCHIVO
        req.archivo = nombre;
        next();
        //ELIMINAR LA ENTRADA DE LA BD
    }else{
        //si las descargas son > a 1 - restar 1
        enlace.descargas --;
        await enlace.save();
    }
}