const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post("/", 
   [
    check("email", "Debes ingresa un email valido, tu email no esta registrado").isEmail(),
    check("password", "La contraseña es incorrecta").not().isEmpty()
   ],
    authController.autenticarUsuario
);

router.get("/",
    auth,
    authController.usuarioAutenticado
);

module.exports = router;