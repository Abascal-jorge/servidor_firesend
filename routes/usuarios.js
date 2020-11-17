const express = require("express");
const router = express.Router();
const usuarioControllers = require("../controllers/usuarioControllers");
const { check } = require("express-validator");

router.post("/", [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "Agrega un email valido").isEmail(),
        check("password", "El password debe ser de al menos 6 caracteres").isLength({min: 6})
    ],
    usuarioControllers.nuevoUsuario    
);

module.exports = router;