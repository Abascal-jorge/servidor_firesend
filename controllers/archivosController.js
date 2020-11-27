//Subida de archivos
const shortid = require("shortid");
const multer = require("multer");
const fs = require("fs");
const Enlaces = require("../models/Enlaces");

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 *1024},
        storage: fileStorage = multer.diskStorage({
            destination: ( req, file, cb) => {
                cb(null, __dirname+`/../uploads`)
            },
            filename: ( req, file, cb)  => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`);
            }
        }) 
    }
    
    const upload = multer(configuracionMulter).single("archivo");


    upload(req, res, async (error) =>{
        //console.log(req.file);
        if(!error){
            res.json({ archivo: req.file.filename });
        }else{
            console.log(error);
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res) => {
    //console.log("desde archivos");

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        //console.log("archivo eliminada"); 
    } catch (error) {
        console.log(error);
    }
}

//Descargar archivo
exports.descargarArchivo = async (req, res, next) => {
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo});
    //console.log(enlace);

    const archivodirectorio = __dirname + `/../uploads/${archivo}`;
    res.download(archivodirectorio);
    
    //Eliminar archivo y collecion

    //SI LAS DESCARGAR SON IGUALES A 1 BORRAR LA ENTRADA Y BORRAR EL ARCHIVO
    const { descargas, nombre } = enlace;
    if(descargas === 1 ){
        //eLIMINAR EL ARCHIVO
        req.archivo = nombre;
        //ELIMINAR LA ENTRADA DE LA BD
        await Enlaces.findOneAndRemove(enlace.id);
        next();
    }else{
        //si las descargas son > a 1 - restar 1
        enlace.descargas --;
        await enlace.save();
    }
} 