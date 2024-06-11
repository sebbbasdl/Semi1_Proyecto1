const conn = require('../database/db.js');
const prefijoBucket = process.env.PREFIJO_BUCKET;

//========================================== CRUD ARTISTAS ==========================================
function getIdArtista(nombre) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_artista FROM Artistas WHERE nombre = ?', nombre, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_artista: result[0].id_artista });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createArtista(nombre, fecha_nacimiento) {
    return new Promise((resolve, reject) => {
        if (fecha_nacimiento != null && fecha_nacimiento != undefined && fecha_nacimiento != '') {
            conn.query('INSERT INTO Artistas (nombre, fecha_nacimiento) VALUES (?, ?)',
            [nombre, fecha_nacimiento], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true, id_artista: result.insertId })
                }
            });
        } else {
            conn.query('INSERT INTO Artistas (nombre) VALUES (?)',
            [nombre, link_foto], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true, id_artista: result.insertId })
                }
            });
        }
    });
}

function readArtistas() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Artistas', (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let artistas = [];
                for (let artista of result) {
                    try {
                        const string_date = `${artista.fecha_nacimiento.getUTCFullYear()}/${artista.fecha_nacimiento.getUTCMonth()+1}/${artista.fecha_nacimiento.getUTCDate()}`;
                        artistas.push({
                            id: artista.id_artista,
                            nombre: artista.nombre,
                            imagen: `${prefijoBucket}Fotos/artistas/${artista.id_artista}.jpg`,
                            nacimiento: string_date
                        })
                    } catch (err) {
                        console.log(err);
                    }
                }
                resolve({ 'artistas': artistas });
            }
        }));
    });
}

function readCancionesArtista(id_artista) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE c.id_artista = ?`, [id_artista], (async (err, result) => {
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
                resolve({ 'canciones': canciones });
            }
        }));
    });
}

function getNombreArtista(id){
    return new Promise((resolve, reject) => {
        conn.query('SELECT nombre FROM Artistas WHERE id_artista = ?', id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ ok: true });
            }
        }));
    });
}

function updateArtista(id_artista, nombre, fecha) {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Artistas 
                    SET nombre = CASE WHEN LENGTH(?) > 0 THEN ? ELSE nombre END,
                        fecha_nacimiento = CASE WHEN LENGTH(?) > 0 THEN ? ELSE fecha_nacimiento END
                    WHERE id_artista = ?`,
                    [nombre, nombre, fecha, fecha, id_artista], ((err, result) => {
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

function deleteArtista(id) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Artistas WHERE id_artista = ?', id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows > 0) {
                    resolve({ ok: true })
                } else {
                    resolve({ ok: false })
                }
            }
        }));
    });
}

//========================================= CRUD CANCIONES ==========================================
function getIdCancion(nombre, id_artista) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_cancion FROM Canciones WHERE nombre = ? AND id_artista = ?', [nombre, id_artista], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_cancion: result[0].id_cancion });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function getIdArtistaCancion(id_cancion) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_artista FROM Canciones WHERE id_cancion = ?', id_cancion, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_artista: result[0].id_artista });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createCancion(nombre, duracion, id_artista) {
    return new Promise((resolve, reject) => {     
        conn.query('INSERT INTO Canciones (nombre, duracion, id_artista) VALUES (?, ?, ?)',
        [nombre, duracion, id_artista], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: true, id_cancion: result.insertId })
            }
        });
    });
}

function readCanciones() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista`, (async (err, result) => {
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
                resolve({ 'canciones': canciones });
            }
        }));
    });
}

function updateCancion(id_cancion, nombre, duracion, id_artista) {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Canciones 
                    SET nombre = CASE WHEN LENGTH(?) > 0 THEN ? ELSE nombre END,
                        duracion = CASE WHEN ? > 0 THEN ? ELSE duracion END,
                        id_artista = CASE WHEN ? > 0 THEN ? ELSE id_artista END
                    WHERE id_cancion = ?`,
                    [nombre, nombre, duracion, duracion, id_artista, id_artista, id_cancion], ((err, result) => {
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

function deleteCancion(id) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Canciones WHERE id_cancion = ?', id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows > 0) {
                    resolve({ ok: true })
                } else {
                    resolve({ ok: false })
                }
            }
        }));
    });
}

//========================================== CRUD ALBUMES ==========================================
function getIdAlbum(nombre, id_artista) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_album FROM Albumes WHERE nombre = ? AND id_artista = ?', [nombre, id_artista], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_album: result[0].id_album });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createAlbum(nombre, descripcion, id_artista) {
    return new Promise((resolve, reject) => {     
        conn.query('INSERT INTO Albumes (nombre, descripcion, id_artista) VALUES (?, ?, ?)',
        [nombre, descripcion, id_artista], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: true, id_album: result.insertId })
            }
        });
    });
}

function readAlbumes() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista FROM Albumes alb
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista`, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let albumes = [];
                for (let album of result) {
                    albumes.push({
                        id: album.id_album,
                        nombre: album.nombre,
                        descripcion: album.descripcion,
                        imagen: `${prefijoBucket}Fotos/albumes/${album.id_album}.jpg`,
                        artista: album.artista
                    })
                }
                resolve({ 'albums': albumes });
            }
        }));
    });
}

function updateAlbum(id_album, nombre, descripcion) {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Albumes 
                    SET nombre = CASE WHEN LENGTH(?) > 0 THEN ? ELSE nombre END,
                        descripcion = CASE WHEN ? > 0 THEN ? ELSE descripcion END
                    WHERE id_album = ?`,
                    [nombre, nombre, descripcion, descripcion, id_album], ((err, result) => {
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

function readCancionesAlbum(id_album) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE c.id_album = ?`, [id_album], (async (err, result) => {
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
                resolve({ 'canciones': canciones });
            }
        }));
    });
}

function addCancionAlbum(id_cancion, id_album) {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE Canciones SET id_album = ? WHERE id_cancion = ?', [id_album, id_cancion], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.changedRows > 0) {
                    resolve({ status: true })
                } else {
                    resolve({ status: false })
                }
            }
        }));
    });
}

function deleteCancionAlbum(id_cancion, id_album) {
    return new Promise((resolve, reject) => {
        //Bastaría con comparar el id_cancion pero por seguridad de que no se elimine una canción de otro album
        conn.query('UPDATE Canciones SET id_album = NULL WHERE id_cancion = ? AND id_album = ?', [id_cancion, id_album], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.changedRows > 0) {
                    resolve({ status: true })
                } else {
                    resolve({ status: false })
                }
            }
        }));
    });
}

function deleteAlbum(id_album) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Albumes WHERE id_album = ?', id_album, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows > 0) {
                    resolve({ ok: true })
                } else {
                    resolve({ ok: false })
                }
            }
        }));
    });
}

module.exports = {
    getIdArtista,
    getIdArtistaCancion,
    getNombreArtista,
    createArtista,
    readArtistas,
    updateArtista,
    deleteArtista,

    getIdCancion,
    createCancion,
    readCanciones,
    updateCancion,
    deleteCancion,

    getIdAlbum,
    createAlbum,
    updateAlbum,
    readAlbumes,
    deleteAlbum,
    readCancionesAlbum,
    readCancionesArtista,
    addCancionAlbum,
    deleteCancionAlbum
}