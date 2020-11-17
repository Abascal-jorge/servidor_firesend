const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env"});


const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Base de datos conectado");
    } catch (error) {
        console.log("Hubo un error");
        console.log(error); //Mostramos el error para depurar la aplicacion
        process.exit(1); // Cerramos el servidor o se corta la ejecucion si no se conecta a la BD
    }
}
 
module.exports = conectarDB;