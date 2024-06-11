var router = require('express').Router();
const sha256 = require('js-sha256');
const { readCanciones, readAlbumes, readArtistas, getIdArtistaCancion } = require('../controller/db_admin')
const { getPerfil, passwordCorrecto, modificarPerfil, buscarCanciones, buscarAlbumes, buscarArtistas,
        favorito, getFavoritos,
        getIdPlaylist, createPlaylist, readPlaylists, addCancionPlaylist, deleteCancionPlaylist, readCancionesPlaylist,
        getTopCanciones, getTopArtistas, getTopAlbums, getHistorial,
        reproducirAlbum, reproducirArtista, reproducirAleatorio } = require('../controller/db_user');
const { guardarImagen } = require('../controller/s3');
const prefijoBucket = process.env.PREFIJO_BUCKET;

router.get('/inicio', async (req, res) => {
    try {
        const c = await readCanciones();
        const alb = await readAlbumes();
        const art = await readArtistas();
        
        res.status(200).json({ canciones: c.canciones, albums: alb.albums, artistas: art.artistas });
    } catch (error) {
        console.log(error);
        res.status(400).json({canciones:[]}, {albums:[]}, {artistas:[]});
    }
});

router.post('/perfil', async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const perfil = await getPerfil(id_usuario);
        res.status(200).json(perfil)
    } catch (error) {
        console.log(error);
        res.status(400).json({ imagen: '', nombre: '', apellido: '', email: '' })
    }
});

router.post('/modificar-perfil', async (req, res) => {
    try {
        const { id_usuario, imagen, nombre, apellido, email, password } = req.body;
        const correcto = await passwordCorrecto(id_usuario, sha256(password));
        if (correcto.status) {
            const result = await modificarPerfil(id_usuario, nombre, apellido, email);
            if (imagen != "") {
                guardarImagen('usuarios/' + id_usuario, imagen);
                result.ok = true;
            }
            return res.status(200).json(result);
        }
        res.status(400).json({ ok : false });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok : false });
    }
});

router.post('/buscar', async (req, res) => {
    try {
        const { id_usuario, buscar } = req.body;
        const c = await buscarCanciones(id_usuario, buscar);
        const alb = await buscarAlbumes(buscar);
        const art = await buscarArtistas(buscar);

        res.status(200).json({ canciones: c.canciones, albums: alb.albums, artistas: art.artistas });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false });
    }
});

router.post('/favorito', async (req, res) => {
    try {
        const { id_usuario, fav } = req.body;
        const result = await favorito(id_usuario, fav);
        res.status(result.ok? 200: 400).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false });
    }
});

router.post('/favorites', async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const result = await getFavoritos(id_usuario);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] });
    }
});

router.post('/playlist', async (req, res) => {
    try {
        const { id_usuario, nombre, descripcion, imagen } = req.body;
        
        const existente = await getIdPlaylist(id_usuario, nombre);
        if (!existente.status) {
            const result = await createPlaylist(id_usuario, nombre, descripcion, imagen);
            if (result.status) {
                return res.status(200).json(result.listado_playlists);
            }
        }
        res.status(400).json({ok: false, playlist: [] });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false, playlist: [] })
    }
});

router.post('/playlists', async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const result = await readPlaylists(id_usuario);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ playlist: [] })
    }
});

router.post('/playlist/add-song', async(req, res) => {
    try {
        const { id_usuario, id_cancion, nombre_playlist } = req.body;
        const playlist = await getIdPlaylist(id_usuario, nombre_playlist);
        if (playlist.status) {
            const result = await addCancionPlaylist(id_cancion, playlist.id_playlist);
            return res.status(200).json(result);
        }
        res.status(400).json({songs: []});
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] })
    }
});

router.post('/playlist/delete-song', async(req, res) => {
    try {
        const { id_usuario, id_cancion, nombre_playlist } = req.body;
        const playlist = await getIdPlaylist(id_usuario, nombre_playlist);
        if (playlist.status) {
            const result = await deleteCancionPlaylist(id_cancion, playlist.id_playlist);
            return res.status(200).json(result);
        }
        res.status(400).json({songs: []});
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] })
    }
});

router.post('/inplaylist', async(req, res) => {
    try {
        const { id_usuario, nombre } = req.body;
        const playlist = await getIdPlaylist(id_usuario, nombre);
        if (playlist.status) {
            const result = await readCancionesPlaylist(playlist.id_playlist);
            const urlImagen = `${prefijoBucket}Fotos/playlists/${playlist.id_playlist}.jpg`;
            return res.status(200).json({ songs: result.canciones, imagen_playlist: urlImagen });
        } else { 
            console.log(`Playlist "${nombre}" de usuario con ID ${id_usuario} no encontrada.`);
        }
        res.status(400).json({ songs: [], imagen_playlist: '' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [], imagen_playlist: '' })
    }
});

router.post('/historial', async(req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const topC = await getTopCanciones(id_usuario);
        const topA = await getTopArtistas(id_usuario);
        const topAlb = await getTopAlbums(id_usuario);
        const historialC = await getHistorial(id_usuario);
        return res.status(200).json({ cancionesRep: topC.canciones, artistaRep: topA.artistas,
                                      albumRep: topAlb.albums, historial: historialC.canciones });
    } catch (error) {
        console.log(error);
        res.status(400).json({ cancionesRep: [], artistaRep: [], albumRep: [], historial: [] })
    }
});

router.post('/reproducir', async (req, res) => {
    const { id, tipo, id_usuario } = req.body;
    try {
        if (tipo == 0) {//Canciones
            const resultArtista = await getIdArtistaCancion(id);
            if (resultArtista.status) {
                const result = await reproducirArtista(id_usuario, resultArtista.id_artista);
                return res.status(200).json(result);
            }
        } else if (tipo == 1) {//Album
            const result = await reproducirAlbum(id_usuario, id);
            return res.status(200).json(result);
        } else if (tipo == 2) {//Artista
            const result = await reproducirArtista(id_usuario, id);
            return res.status(200).json(result);
        }
        res.status(400).json({ tracks: [] });
    } catch {
        console.log(error);
        res.status(400).json({ tracks: [] });
    }

});

router.post('/reproducir-aleatorio', async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const result = await reproducirAleatorio(id_usuario);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ tracks: [] });
    }
});

module.exports = router;