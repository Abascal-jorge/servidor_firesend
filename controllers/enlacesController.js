const Enlaces = require("../models/Enlaces");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

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