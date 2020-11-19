const Enlaces = require("../models/Enlaces");
const shortid = require("shortid");

exports.nuevoEnlace = async (req, res,next) => {
   
    //Reisar si hay errores
    console.log(req.body);
    //Crear un objeto
    const { nombre_original, password } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;
    enlace.password = password;

    //Si el usuario esta autenticdo

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