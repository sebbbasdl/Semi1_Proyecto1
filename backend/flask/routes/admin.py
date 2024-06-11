from flask import Blueprint, request, jsonify
from functions.db_admin import (getIdArtista, createArtista, readArtistas, updateArtista, deleteArtista,
                     getIdCancion, createCancion, readCanciones, updateCancion, deleteCancion,
                     getIdAlbum, createAlbum, updateAlbum, deleteAlbum, readCancionesAlbum,
                     addCancionAlbum, deleteCancionAlbum, readAlbumes)
from mis3.config_s3 import guardarImagen, guardarCancion

prefijoBucket = "https://multimedia-semi1-g9.s3.amazonaws.com/"

admin_routes = Blueprint('admin_routes', __name__)

@admin_routes.route('/crear-artista', methods=['POST'])
def crear_artista():
    data = request.json
    nombre = data['nombre']
    imagen = data['imagen']
    fecha = data['fecha']
    
    try:
        existente = getIdArtista(nombre)
        if not existente['status']:
            result = createArtista(nombre, fecha)
            if result['status']:
                guardarImagen('artistas/' + str(result['id_artista']), imagen)
                return jsonify({'ok': True}), 200
    except Exception as e:
        print(e)
    
    return jsonify({'ok': False}), 400

@admin_routes.route('/get-artistas', methods=['GET'])
def get_artistas():
    try:
        result = readArtistas()
        return jsonify(result), 200
    except Exception as e:
        print(e)
    
    return jsonify({'artistas': []}), 400

@admin_routes.route('/actualizar-artista', methods=['POST'])
def actualizar_artista():
    data = request.json
    id = data['id']
    nombre = data['nombre']
    imagen = data['imagen']
    fecha = data['fecha']

    try:
        result = updateArtista(id, nombre, fecha)
        if imagen != '':
            guardarImagen('artistas/' + str(id), imagen)
            result['ok'] = True
        return jsonify(result), 200
    except Exception as e:
        print(e)

    return jsonify({'ok': False}), 400

@admin_routes.route('/eliminar-artista', methods=['POST'])
def eliminar_artista():
    data = request.json
    id = data['id']

    try:
        result = deleteArtista(id)
        return jsonify(result), 200
    except Exception as e:
        print(e)

    return jsonify({'ok': False}), 400

@admin_routes.route('/crear-cancion', methods=['POST'])
def crear_cancion():
    data = request.json
    nombre = data['nombre']
    imagen = data['imagen']
    duracion = data['duracion']
    artista = data['artista']
    mp3 = data['mp3']

    try:
        res_artista = getIdArtista(artista)
        if res_artista['status']:
            existente = getIdCancion(nombre, res_artista['id_artista'])
            if not existente['status']:
                result = createCancion(nombre, duracion, res_artista['id_artista'])
                if result['status']:
                    guardarImagen('canciones/' + str(result['id_cancion']), imagen)
                    guardarCancion(result['id_cancion'], mp3)
                    return jsonify({'ok': True}), 200
    except Exception as e:
        print(e)

    return jsonify({'ok': False}), 400
    
# Continuación del código anterior

@admin_routes.route('/get-canciones', methods=['GET'])
def get_canciones():
    try:
        result = readCanciones()
        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({'canciones': []}), 400

@admin_routes.route('/actualizar-cancion', methods=['POST'])
def actualizar_cancion():
    data = request.json
    id_cancion = data['id']
    nombre = data['nombre']
    imagen = data['imagen']
    duracion = data['duracion']
    artista = data['artista']
    mp3 = data['mp3']

    try:
        if duracion == "":
            duracion = 0
        id_artista = 0
        if artista != "":
            resultado_artista = getIdArtista(artista)
            if resultado_artista['status']:
                id_artista = resultado_artista['id_artista']
            else:
                return jsonify({'ok': False}), 200

        result = updateCancion(id_cancion, nombre, duracion, id_artista)
        if imagen != "":
            guardarImagen('canciones/' + str(id_cancion), imagen)
            result['ok'] = True
        if mp3 != "":
            guardarCancion(id_cancion, mp3)
            result['ok'] = True

        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({'ok': False}), 400

@admin_routes.route('/eliminar-cancion', methods=['POST'])
def eliminar_cancion():
    data = request.json
    id_cancion = data['id']

    try:
        result = deleteCancion(id_cancion)
        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({'ok': False}), 400

@admin_routes.route('/crear-album', methods=['POST'])
def crear_album():
    data = request.json
    nombre = data['nombre']
    descripcion = data['descripcion']
    imagen = data['imagen']
    artista = data['artista']

    try:
        res_artista = getIdArtista(artista)
        if res_artista['status']:
            existente = getIdAlbum(nombre, res_artista['id_artista'])
            if not existente['status']:
                result = createAlbum(nombre, descripcion, res_artista['id_artista'])
                if result['status']:
                    guardarImagen('albumes/' + str(result['id_album']), imagen)
                    return jsonify({'ok': True}), 200
    except Exception as e:
        print(e)

    return jsonify({'ok': False}), 400

@admin_routes.route('/actualizar-album', methods=['POST'])
def actualizar_album():
    data = request.json
    nombre_antes = data['nombre_antes']
    artista = data['artista']
    nuevo_nombre = data['nuevo_nombre']
    descripcion = data['descripcion']
    imagen = data['imagen']

    try:
        res_artista = getIdArtista(artista)
        if res_artista['status']:
            album = getIdAlbum(nombre_antes, res_artista['id_artista'])
            if album['status']:
                result = updateAlbum(album['id_album'], nuevo_nombre, descripcion)
                if imagen != "":
                    guardarImagen('albumes/' + str(album['id_album']), imagen)
                    result['ok'] = True
                return jsonify(result), 200
            else:
                print(f'Album "{nombre_antes}" no existe.')
        else:
            print(f'Artista "{artista}" no existe.')

        return jsonify({'ok': False}), 200
    except Exception as e:
        print(e)
        return jsonify({'ok': False}), 400

@admin_routes.route('/delete-album', methods=['POST'])
def eliminar_album():
    data = request.json
    id_album = data['id']

    try:
        result = deleteAlbum(id_album)
        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({'ok': False}), 400

@admin_routes.route('/album', methods=['GET'])
def get_albumes():
    try:
        result = readAlbumes()
        return jsonify({'album': result['albums']}), 200
    except Exception as e:
        print(e)
        return jsonify({'ok': False}), 400

@admin_routes.route('/inalbum', methods=['POST'])
def obtener_canciones_album():
    data = request.json
    nombre = data['nombre']
    artista = data['artista']

    try:
        result_artista = getIdArtista(artista)
        if result_artista['status']:
            album = getIdAlbum(nombre, result_artista['id_artista'])
            if album['status']:
                result = readCancionesAlbum(album['id_album'])
                url_imagen = f'{prefijoBucket}Fotos/albumes/{album["id_album"]}.jpg'
                return jsonify({'songs': result['canciones'], 'imagen_album': url_imagen}), 200
            else:
                print(f'Album "{nombre}" no existe.')
        else:
            print(f'Artista "{artista}" no existe.')

        return jsonify({'songs': [], 'imagen_album': ''}), 200
    except Exception as e:
        print(e)
        return jsonify({'songs': [], 'imagen_album': ''}), 400

@admin_routes.route('/add-song-album', methods=['POST'])
def agregar_cancion_album():
    data = request.json
    id_cancion = data['id_cancion']
    nombre_album = data['nombre_album']
    artista = data['artista']

    try:
        res_artista = getIdArtista(artista)
        if res_artista['status']:
            album = getIdAlbum(nombre_album, res_artista['id_artista'])
            if album['status']:
                result = addCancionAlbum(id_cancion, album['id_album'])
                if result['status']:
                    c = readCancionesAlbum(album['id_album'])
                    return jsonify({'songs': c['canciones']}), 200
    except Exception as e:
        print(e)

    return jsonify({'songs': []}), 400

@admin_routes.route('/delete-song-album', methods=['POST'])
def eliminar_cancion_album():
    data = request.json
    id_cancion = data['id_cancion']
    nombre_album = data['nombre_album']
    artista = data['artista']

    try:
        res_artista = getIdArtista(artista)
        if res_artista['status']:
            album = getIdAlbum(nombre_album, res_artista['id_artista'])
            if album['status']:
                result = deleteCancionAlbum(id_cancion, album['id_album'])
                if result['status']:
                    c = readCancionesAlbum(album['id_album'])
                    return jsonify({'songs': c['canciones']}), 200
    except Exception as e:
        print(e)

    return jsonify({'songs': []}), 400

