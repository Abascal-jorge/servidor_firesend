const express = require("express");
const router = express.Router();
const usuarioControllers = require("../controllers/usuarioControllers");;

router.post("/",
    usuarioControllers.nuevoUsuario    
);

module.exports = router;