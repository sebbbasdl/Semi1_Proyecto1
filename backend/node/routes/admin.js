var router = require('express').Router();

const { getIdArtista, createArtista, readArtistas, updateArtista, deleteArtista,
        getIdCancion, createCancion, readCanciones, updateCancion, deleteCancion,
        getIdAlbum, createAlbum, updateAlbum, deleteAlbum, readCancionesAlbum, addCancionAlbum, deleteCancionAlbum, readAlbumes  } = require('../controller/db_admin');
const { guardarImagen, guardarCancion } = require('../controller/s3');
const prefijoBucket = process.env.PREFIJO_BUCKET;

router.post('/crear-artista', async (req, res) => {
    const { nombre, imagen, fecha } = req.body;
    try {
        const existente = await getIdArtista(nombre);
        if (!existente.status) {
            const result = await createArtista(nombre, fecha);
            if (result.status) {
                guardarImagen('artistas/'+ result.id_artista, imagen);
                return res.status(200).json({ok: true});
            }
        }
        res.status(400).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.get('/get-artistas', async (req, res) => {
    try {
        const result = await readArtistas();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ 'artistas': [] });
    }
});

router.post('/actualizar-artista', async (req, res) => {
    let { id, nombre, imagen, fecha } = req.body;
    try {
        const result = await updateArtista(id, nombre, fecha);
        if (imagen != '') {
            guardarImagen('artistas/'+ id, imagen);
            result.ok = true;
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.post('/eliminar-artista', async (req, res) => {
    const id = req.body.id;
    try {
        const result = await deleteArtista(id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.post('/crear-cancion', async (req, res) => {
    const { nombre, imagen, duracion, artista, mp3 } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const existente = await getIdCancion(nombre, res_artista.id_artista);
            if (!existente.status) {
                const result = await createCancion(nombre, duracion, res_artista.id_artista);
                if (result.status) {
                    guardarImagen('canciones/'+ result.id_cancion, imagen);
                    guardarCancion(result.id_cancion, mp3)
                    return res.status(200).json({ok: true});
                }   
            }
        }
        res.status(400).json({ok: false})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.get('/get-canciones', async (req, res) => {
    try {
        const result = await readCanciones();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({canciones: []});
    }
});

router.post('/actualizar-cancion', async (req, res) => {
    let { id, nombre, imagen, duracion, artista, mp3 } = req.body;
    try {
        if (duracion == "") {
            duracion = 0;
        }
        let id_artista = 0;
        if (artista != "") {
            const resultadoArtista = await getIdArtista(artista);
            if (resultadoArtista.status) {
                id_artista = resultadoArtista.id_artista;
            } else {
                return res.status(200).json(result);
            }
            
        }
        const result = await updateCancion(id, nombre, duracion, id_artista);
        if (imagen != '') {
            guardarImagen('canciones/'+ id, imagen);
            result.ok = true;
        }
        if (mp3 != '') {
            guardarCancion(id, imagen);
            result.ok = true;
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.post('/eliminar-cancion', async (req, res) => {
    const id = req.body.id;
    try {
        const result = await deleteCancion(id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.post('/crear-album', async (req, res) => {
    const { nombre, descripcion, imagen, artista } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const existente = await getIdAlbum(nombre, res_artista.id_artista);
            if (!existente.status) {
                const result = await createAlbum(nombre, descripcion, res_artista.id_artista);
                if (result.status) {
                    guardarImagen('albumes/'+ result.id_album, imagen);
                    return res.status(200).json({ok: true});
                }   
            }
        }
        res.status(400).json({ok: false})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.post('/actualizar-album', async (req, res) => {
    const { nombre_antes, artista, nuevo_nombre, descripcion, imagen } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const album = await getIdAlbum(nombre_antes, res_artista.id_artista);
            if (album.status) {
                const result = await updateAlbum(album.id_album, nuevo_nombre, descripcion);
                if (imagen != '') {
                    guardarImagen('albumes/'+ album.id_album, imagen);
                    result.ok = true;
                }
                return res.status(200).json(result);
            } else {
                console.log(`Album "${nombre_antes}" no existe.`);
            }
        } else {
            console.log(`Artista "${artista}" no existe.`);
        }
        res.status(200).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.post('/delete-album', async (req, res) => {
    const id_album = req.body.id;
    try {
        const result = await deleteAlbum(id_album);
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.get('/album', async (req, res) => {
    try {
        const result = await readAlbumes();
        return res.status(200).json({ album: result.albums });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false });
    }
});

router.post('/inalbum', async (req, res) => {
    try {
        const { nombre, artista } = req.body;
        const result_artista = await getIdArtista(artista);
        if (result_artista.status) {
            const album = await getIdAlbum(nombre, result_artista.id_artista);
            if (album.status) {
                const result = await readCancionesAlbum(album.id_album);
                const urlImagen = `${prefijoBucket}Fotos/albumes/${album.id_album}.jpg`;
                return res.status(200).json({ songs: result.canciones, imagen_album: urlImagen });
            } else {
                console.log(`Album "${nombre}" no existe.`);
            }
        } else {
            console.log(`Artista "${artista}" no existe.`);
        }
        res.status(200).json({songs: [], imagen_album: ''})
    } catch (error) {
        console.log(error);
        res.status(400).json({songs: [], imagen_album: ''})
    }
});

router.post('/add-song-album', async (req, res) => {
    const { id_cancion, nombre_album, artista } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const album = await getIdAlbum(nombre_album, res_artista.id_artista);
            if (album.status) {
                const result = await addCancionAlbum(id_cancion, album.id_album);
                if (result.status) {
                    const c = await readCancionesAlbum(album.id_album);
                    return res.status(200).json({songs: c.canciones});
                }   
            }
        }
        res.status(400).json({songs: []})
    } catch (error) {
        console.log(error);
        res.status(400).json({songs: []})
    }
});

router.post('/delete-song-album', async (req, res) => {
    const { id_cancion, nombre_album, artista } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const album = await getIdAlbum(nombre_album, res_artista.id_artista);
            if (album.status) {
                const result = await deleteCancionAlbum(id_cancion, album.id_album);
                if (result.status) {
                    const c = await readCancionesAlbum(album.id_album);
                    return res.status(200).json({songs: c.canciones});
                }   
            }
        }
        res.status(400).json({songs: []})
    } catch (error) {
        console.log(error);
        res.status(400).json({songs: []})
    }
});

module.exports = router;