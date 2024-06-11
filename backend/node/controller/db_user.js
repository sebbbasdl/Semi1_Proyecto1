const conn = require('../database/db.js');
const { guardarImagen } = require('./s3.js');
const { readCancionesAlbum, readCancionesArtista } = require ('./db_admin.js');
const prefijoBucket = process.env.PREFIJO_BUCKET;

function loginUsuario(correo, password) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_usuario FROM Usuarios WHERE correo = ? AND password = ?', [correo, password], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_usuario: result[0].id_usuario });
                } else {
                    resolve({ status: false });
                }
                
            }
        }));
    });
}

function passwordCorrecto(id_usuario, password) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT password FROM Usuarios WHERE id_usuario = ? AND password = ?', [id_usuario, password], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true });
                } else {
                    resolve({ status: false });
                }
                
            }
        }));
    });
}

function existeUsuario(correo) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT 1 FROM Usuarios WHERE correo = ?', correo, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: (result.length > 0)});
             }
        }));
    });
}

function registrarUsuario(nombres, apellidos, correo, pass, fecha) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Usuarios (nombres, apellidos, correo, password, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)',
            [nombres, apellidos, correo, pass, fecha], ((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true, id_usuario: result.insertId});
                }
            }));
    });
}

//============================================= BUSCAR =============================================
function buscarCanciones(id_usuario, palabra) {
    palabra = `%${palabra}%`;
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista, f.id_usuario AS favorito FROM Canciones c
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    LEFT JOIN Favoritos f ON f.id_cancion = c.id_cancion
                    WHERE c.nombre LIKE ? AND (f.id_usuario = ? OR f.id_usuario IS NULL)`, [palabra, id_usuario], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        id: cancion.id_cancion,
                        nombre: cancion.nombre,
                        imagen: `${prefijoBucket}Fotos/canciones/${cancion.id_cancion}.jpg`,
                        duracion: cancion.duracion,
                        artista: cancion.artista,
                        esFavorito: cancion.favorito? true : false
                    })
                }
                resolve({ 'canciones': canciones });
            }
        }));
    });
}

function buscarAlbumes(palabra) {
    palabra = `%${palabra}%`;
    return new Promise((resolve, reject) => {
        conn.query(`SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista FROM Albumes alb
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista
                    WHERE alb.nombre LIKE ?`, palabra, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let albumes = [];
                for (let album of result) {
                    const c = await readCancionesAlbum(album.id_album);
                    albumes.push({
                        id: album.id_album,
                        nombre: album.nombre,
                        imagen: `${prefijoBucket}Fotos/albumes/${album.id_album}.jpg`,
                        artista: album.artista,
                        canciones: c.canciones
                    })
                }
                resolve({ 'albums': albumes });
            }
        }));
    });
}

function buscarArtistas(palabra) {
    palabra = `%${palabra}%`;
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id_artista, nombre FROM Artistas
                    WHERE nombre LIKE ?`, palabra, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let artistas = [];
                for (let artista of result) {
                    const c = await readCancionesArtista(artista.id_artista);
                    artistas.push({
                        id: artista.id_artista,
                        nombre: artista.nombre,
                        imagen: `${prefijoBucket}Fotos/artistas/${artista.id_artista}.jpg`,
                        canciones: c.canciones
                    })
                }
                resolve({ 'artistas': artistas });
            }
        }));
    });
}

//============================================= PERFIL =============================================
function getPerfil(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_usuario, nombres, apellidos, correo FROM Usuarios WHERE id_usuario = ?', id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({
                        nombre: result[0].nombres,
                        apellido: result[0].apellidos, 
                        imagen: `${prefijoBucket}Fotos/usuarios/${result[0].id_usuario}.jpg`,
                        email: result[0].correo 
                    });
                } else {
                    reject("No existe el usuario")
                }
            }
        }));
    });
}

function modificarPerfil(id_usuario, nombres, apellidos, correo) {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Usuarios
                    SET nombres = CASE WHEN LENGTH(?) > 0 THEN ? ELSE nombres END,
                    apellidos = CASE WHEN LENGTH(?) > 0 THEN ? ELSE apellidos END,
                    correo = CASE WHEN LENGTH(?) > 0 THEN ? ELSE correo END
                    WHERE id_usuario = ?`,
                    [nombres, nombres, apellidos, apellidos, correo, correo, id_usuario], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.changedRows > 0) {
                    resolve({ ok: true })
                } else {
                    resolve({ ok: false })
                }
            }
        }));
    });
}

//=========================================== FAVORITOS ============================================
function favorito(id_usuario, id_cancion) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT 1 FROM Favoritos WHERE id_usuario = ? AND id_cancion = ?', [id_usuario, id_cancion], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {//Se quita de favoritos
                    conn.query('DELETE FROM Favoritos WHERE id_usuario = ? AND id_cancion = ?', [id_usuario, id_cancion], ((err, res) => {
                        if (res.affectedRows > 0) {
                            resolve({ ok: true })
                        } else {
                            resolve({ ok: false })
                        }
                    }));
                } else {//Se agrega a favoritos
                    conn.query('INSERT INTO Favoritos (id_usuario, id_cancion) VALUES (?, ?)', [id_usuario, id_cancion], ((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ ok: true });
                        }
                    }));
                }
            }
        }));
    });
}

function getFavoritos(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, art.nombre AS artista FROM Favoritos f
                    LEFT JOIN Canciones c ON c.id_cancion = f.id_cancion
                    LEFT JOIN Artistas art ON art.id_artista = c.id_artista
                    WHERE f.id_usuario = ?`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        id: cancion.id_cancion,
                        nombre: cancion.nombre,
                        imagen: `${prefijoBucket}Fotos/canciones/${cancion.id_cancion}.jpg`,
                        duracion: cancion.duracion,
                        artista: cancion.artista
                    })
                }
                resolve({ 'songs': canciones });
            }
        }));
    });
}

//========================================= CRUD PLAYLISTS ==========================================
function getIdPlaylist(id_usuario, nombre) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_playlist FROM Playlists WHERE id_usuario = ? AND nombre = ?', [id_usuario, nombre], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_playlist: result[0].id_playlist });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createPlaylist(id_usuario, nombre, descripcion, imagen) {
    return new Promise((resolve, reject) => {
        descripcion = descripcion? descripcion : '';
        conn.query('INSERT INTO Playlists (nombre, descripcion, id_usuario) VALUES (?, ?, ?)', [nombre, descripcion, id_usuario], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                guardarImagen('playlists/'+ result.insertId, imagen);
                resolve({ status: true, listado_playlists: await readPlaylists(id_usuario) });
            }
        }));
    });
}

function readPlaylists(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id_playlist, nombre, descripcion FROM Playlists
                    WHERE id_usuario = ?`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let playlists = [];
                for (let playlist of result) {
                    playlists.push({
                        nombre: playlist.nombre,
                        descripcion: playlist.descripcion,
                        imagen: `${prefijoBucket}Fotos/playlists/${playlist.id_playlist}.jpg`
                    })
                }
                resolve({ 'playlist': playlists });
            }
        }));
    });
}

function addCancionPlaylist(id_cancion, id_playlist) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Playlist_canciones (id_playlist, id_cancion) VALUES (?, ?)',
                   [id_playlist, id_cancion], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                const canciones = await readCancionesPlaylist(id_playlist);
                resolve({ 'songs': canciones.canciones });
            }
        }));
    });
}

function deleteCancionPlaylist(id_cancion, id_playlist) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Playlist_canciones WHERE id_playlist = ? AND id_cancion = ?',
                   [id_playlist, id_cancion], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                const canciones = await readCancionesPlaylist(id_playlist);
                resolve({ 'songs': canciones.canciones });
            }
        }));
    });
}

function readCancionesPlaylist(id_playlist) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Playlist_canciones pc
                    LEFT JOIN Canciones c ON c.id_cancion = pc.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE pc.id_playlist = ?`, id_playlist, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        id: cancion.id_cancion,
                        nombre: cancion.nombre,
                        duracion: cancion.duracion,
                        imagen: `${prefijoBucket}Fotos/canciones/${cancion.id_cancion}.jpg`,
                        artista: cancion.artista
                    })
                }
                resolve({ 'canciones': canciones });
            }
        }));
    });
}


//============================================ HISTÓRICO ============================================
function getTopCanciones(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.nombre, a.nombre AS artista, COUNT(*) AS veces FROM Reproducciones r
                    LEFT JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE r.id_usuario = ?
                    GROUP BY r.id_cancion
                    ORDER BY veces DESC
                    LIMIT 5`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'canciones': result });
            }
        }));
    });
}

function getTopArtistas(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT a.nombre, COUNT(*) AS veces FROM Reproducciones r
                    INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE r.id_usuario = ?
                    GROUP BY a.nombre
                    ORDER BY veces DESC
                    LIMIT 3`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'artistas': result });
            }
        }));
    });
}

function getTopAlbums(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT alb.nombre, a.nombre AS artista, COUNT(*) AS veces FROM Reproducciones r
                    INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Albumes alb ON alb.id_album = c.id_album
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista
                    WHERE r.id_usuario = ?
                    GROUP BY alb.nombre, artista
                    ORDER BY veces DESC
                    LIMIT 5`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'albums': result });
            }
        }));
    });
}

function getHistorial(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.nombre, a.nombre AS artista, c.duracion FROM Reproducciones r
                    INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE r.id_usuario = ?
                    ORDER BY r.id_reproduccion DESC`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'canciones': result });
            }
        }));
    });
}

//========================================== REPRODUCCIÓN ==========================================
function reproducirAlbum(id_usuario, id_album) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id_cancion, nombre FROM Canciones c
                    WHERE id_album = ?`, id_album, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        nombre: cancion.nombre,
                        url: `${prefijoBucket}Canciones/${cancion.id_cancion}.mp3`
                    })
                    conn.query(`INSERT INTO Reproducciones (id_usuario, id_cancion)
                        VALUES(?, ?)`, [id_usuario, cancion.id_cancion], ((err, result) => {
                        if (err) {
                            reject(err);
                        }
                    }));
                }
                resolve({ 'tracks': canciones });
            }
        }));
    });
}

function reproducirArtista(id_usuario, id_artista) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id_cancion, nombre FROM Canciones c
                    WHERE id_artista = ?`, id_artista, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        nombre: cancion.nombre,
                        url: `${prefijoBucket}Canciones/${cancion.id_cancion}.mp3`,
                    })
                    conn.query(`INSERT INTO Reproducciones (id_usuario, id_cancion)
                        VALUES(?, ?)`, [id_usuario, cancion.id_cancion], ((err, result) => {
                        if (err) {
                            reject(err);
                        }
                    }));
                }
                resolve({ 'tracks': canciones });
            }
        }));
    });
}

function reproducirAleatorio(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id_cancion, nombre FROM Canciones c
                    ORDER BY RAND()`, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        nombre: cancion.nombre,
                        url: `${prefijoBucket}Canciones/${cancion.id_cancion}.mp3`,
                    })
                    conn.query(`INSERT INTO Reproducciones (id_usuario, id_cancion)
                        VALUES(?, ?)`, [id_usuario, cancion.id_cancion], ((err, result) => {
                        if (err) {
                            reject(err);
                        }
                    }));
                }
                resolve({ 'tracks': canciones });
            }
        }));
    });
}

module.exports = {
    loginUsuario,
    existeUsuario,
    registrarUsuario,

    getPerfil,
    passwordCorrecto,
    modificarPerfil,
    buscarCanciones,

    favorito,
    getFavoritos,

    getIdPlaylist,
    createPlaylist,
    readPlaylists,
    addCancionPlaylist,
    deleteCancionPlaylist,
    readCancionesPlaylist,

    getTopCanciones,
    getTopArtistas,
    getTopAlbums,
    getHistorial,

    buscarCanciones,
    buscarAlbumes,
    buscarArtistas,

    reproducirAlbum,
    reproducirArtista,
    reproducirAleatorio
}