const sha256 = require('js-sha256');
const router = require('express').Router();

const { loginUsuario, registrarUsuario, existeUsuario } = require('../controller/db_user')
const { guardarImagen } = require('../controller/s3');

router.get('/', (req, res) => {
    res.status(200).json({"message": "API corriendo"});
});

router.post('/login', async (req, res) => {
    const correo = req.body.email;
    const pass = sha256(req.body.password);

    try {
        const result = await loginUsuario(correo, pass);
        if (result.status) {
            res.status(200).json({ok: true, id_usuario: result.id_usuario})
        } else {
            res.status(400).json({ok: false})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/registro', async (req, res) => {
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const imagen = req.body.imagen;
    const correo = req.body.correo;
    const password = sha256(req.body.password);
    const fecha = req.body.fecha;

    if (nombres === "" || apellidos === "" || correo === "" || imagen === "") {
        res.status(400).json({"ok": false});
    } else {
        try {
            const result1 = await existeUsuario(correo);
            if (!result1.status) {
                const result = await registrarUsuario(nombres, apellidos, correo, password, fecha);
                if (result.status) {
                    guardarImagen('usuarios/' + result.id_usuario, imagen);
                    return res.status(200).json({ok: true})
                }
            }
            res.status(400).json({ok: false})
        } catch (error) {
            console.log(error);
            res.status(400).json({ok: false})
        }
    }
});

module.exports = router;