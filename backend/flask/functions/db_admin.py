import mysql.connector
import os

# Variables de configuración de la base de datos
db_config = {
    'host': 'semi-p1.ct2boqzs8ewg.us-east-1.rds.amazonaws.com',
    'user': 'admin',
    'password': '123456789',
    'database': 'db_semi1_p1',
    'port': 3306,
}

# Variable global para almacenar la conexión
conn = None

# Función para establecer la conexión a la base de datos
def conectar_a_bd():
    global conn
    if conn is None:
        try:
            conn = mysql.connector.connect(**db_config)
            print("Conexión a la base de datos establecida.")
        except mysql.connector.Error as err:
            print(f"Error al conectar a la base de datos: {err}")
    return conn

# Ejecutar la función para establecer la conexión una vez
conectar_a_bd()

prefijoBucket = "https://multimedia-semi1-g9.s3.amazonaws.com/"

#========================================== CRUD ARTISTAS ==========================================
def getIdArtista(nombre):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id_artista FROM Artistas WHERE nombre = %s', (nombre,))
        result = cursor.fetchone()
        if result:
            return {'status': True, 'id_artista': result[0]}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def createArtista(nombre, fecha_nacimiento=None):
    cursor = conn.cursor()
    try:
        if fecha_nacimiento:
            cursor.execute('INSERT INTO Artistas (nombre, fecha_nacimiento) VALUES (%s, %s)', (nombre, fecha_nacimiento))
        else:
            cursor.execute('INSERT INTO Artistas (nombre) VALUES (%s)', (nombre,))
        conn.commit()
        return {'status': True, 'id_artista': cursor.lastrowid}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def readArtistas():
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT * FROM Artistas')
        artistas = []
        for artista in cursor:
            try:
                string_date = f"{artista['fecha_nacimiento'].year}/{artista['fecha_nacimiento'].month}/{artista['fecha_nacimiento'].day}"
                artistas.append({
                    'id': artista['id_artista'],
                    'nombre': artista['nombre'],
                    'imagen': f"{prefijoBucket}Fotos/artistas/{artista['id_artista']}.jpg",
                    'nacimiento': string_date
                })
            except Exception as e:
                print(e)
        return {'artistas': artistas}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def readCancionesArtista(id_artista):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c INNER JOIN Artistas a ON a.id_artista = c.id_artista WHERE c.id_artista = %s', (id_artista,))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'id': cancion['id_cancion'],
                'nombre': cancion['nombre'],
                'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                'duracion': cancion['duracion'],
                'artista': cancion['artista']
            })
        return {'canciones': canciones}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def getNombreArtista(id):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT nombre FROM Artistas WHERE id_artista = %s', (id,))
        result = cursor.fetchone()
        if result:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def updateArtista(id_artista, nombre=None, fecha=None):
    cursor = conn.cursor()
    try:
        params = []
        actualizacion = 'SET '

        if nombre:
            actualizacion += 'nombre = %s, '
            params.extend([nombre, nombre])
        if fecha:
            actualizacion += 'fecha_nacimiento = %s, '
            params.extend([fecha, fecha])

        if actualizacion.endswith(', '):
            actualizacion = actualizacion[:-2]  # Eliminar la última coma y espacio

        params.append(id_artista)
        cursor.execute(f'UPDATE Artistas {actualizacion} WHERE id_artista = %s', params)
        conn.commit()

        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def deleteArtista(id):
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM Artistas WHERE id_artista = %s', (id,))
        conn.commit()

        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

#========================================= CRUD CANCIONES ==========================================
def getIdCancion(nombre, id_artista):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id_cancion FROM Canciones WHERE nombre = %s AND id_artista = %s', (nombre, id_artista))
        result = cursor.fetchone()
        if result:
            return {'status': True, 'id_cancion': result[0]}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

# ... (Las funciones CRUD de artistas que se proporcionaron anteriormente)

#========================================= CRUD CANCIONES ==========================================
def getIdArtistaCancion(id_cancion):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id_artista FROM Canciones WHERE id_cancion = %s', (id_cancion,))
        result = cursor.fetchone()
        if result:
            return {'status': True, 'id_artista': result[0]}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def createCancion(nombre, duracion, id_artista):
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO Canciones (nombre, duracion, id_artista) VALUES (%s, %s, %s)', (nombre, duracion, id_artista))
        conn.commit()
        return {'status': True, 'id_cancion': cursor.lastrowid}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def readCanciones():
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c INNER JOIN Artistas a ON a.id_artista = c.id_artista')
        canciones = []
        for cancion in cursor:
            canciones.append({
                'id': cancion['id_cancion'],
                'nombre': cancion['nombre'],
                'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                'duracion': cancion['duracion'],
                'artista': cancion['artista']
            })
        return {'canciones': canciones}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def updateCancion(id_cancion, nombre=None, duracion=None, id_artista=None):
    cursor = conn.cursor()
    try:
        params = []
        actualizacion = 'SET '

        if nombre:
            actualizacion += 'nombre = %s, '
            params.extend([nombre, nombre])
        if duracion is not None:
            actualizacion += 'duracion = %s, '
            params.extend([duracion, duracion])
        if id_artista is not None:
            actualizacion += 'id_artista = %s, '
            params.extend([id_artista, id_artista])

        if actualizacion.endswith(', '):
            actualizacion = actualización[:-2]  # Eliminar la última coma y espacio

        params.append(id_cancion)
        cursor.execute(f'UPDATE Canciones {actualizacion} WHERE id_cancion = %s', params)
        conn.commit()

        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def deleteCancion(id):
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM Canciones WHERE id_cancion = %s', (id,))
        conn.commit()

        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

#========================================== CRUD ALBUMES ==========================================
def getIdAlbum(nombre, id_artista):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id_album FROM Albumes WHERE nombre = %s AND id_artista = %s', (nombre, id_artista))
        result = cursor.fetchone()
        if result:
            return {'status': True, 'id_album': result[0]}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def createAlbum(nombre, descripcion, id_artista):
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO Albumes (nombre, descripcion, id_artista) VALUES (%s, %s, %s)', (nombre, descripcion, id_artista))
        conn.commit()
        return {'status': True, 'id_album': cursor.lastrowid}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def readAlbumes():
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista FROM Albumes alb INNER JOIN Artistas a ON a.id_artista = alb.id_artista')
        albumes = []
        for album in cursor:
            albumes.append({
                'id': album['id_album'],
                'nombre': album['nombre'],
                'descripcion': album['descripcion'],
                'imagen': f"{prefijoBucket}Fotos/albumes/{album['id_album']}.jpg",
                'artista': album['artista']
            })
        return {'albums': albumes}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def updateAlbum(id_album, nombre=None, descripcion=None):
    cursor = conn.cursor()
    try:
        params = []
        actualizacion = 'SET '

        if nombre:
            actualizacion += 'nombre = %s, '
            params.extend([nombre, nombre])
        if descripcion:
            actualizacion += 'descripcion = %s, '
            params.extend([descripcion, descripcion])

        if actualizacion.endswith(', '):
            actualizacion = actualizacion[:-2]  # Eliminar la última coma y espacio

        params.append(id_album)
        cursor.execute(f'UPDATE Albumes {actualizacion} WHERE id_album = %s', params)
        conn.commit()

        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def readCancionesAlbum(id_album):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c INNER JOIN Artistas a ON a.id_artista = c.id_artista WHERE c.id_album = %s', (id_album,))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'id': cancion['id_cancion'],
                'nombre': cancion['nombre'],
                'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                'duracion': cancion['duracion'],
                'artista': cancion['artista']
            })
        return {'canciones': canciones}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def addCancionAlbum(id_cancion, id_album):
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE Canciones SET id_album = %s WHERE id_cancion = %s', (id_album, id_cancion))
        conn.commit()

        if cursor.rowcount > 0:
            return {'status': True}
        else:
            return {'status': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def deleteCancionAlbum(id_cancion, id_album):
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE Canciones SET id_album = NULL WHERE id_cancion = %s AND id_album = %s', (id_cancion, id_album))
        conn.commit()

        if cursor.rowcount > 0:
            return {'status': True}
        else:
            return {'status': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def deleteAlbum(id_album):
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM Albumes WHERE id_album = %s', (id_album,))
        conn.commit()

        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

