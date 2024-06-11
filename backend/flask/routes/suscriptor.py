from flask import Blueprint, request, jsonify
import hashlib
from functions.db_admin import (
    readCanciones,
    readAlbumes,
    readArtistas,
    getIdArtistaCancion,
)
from controller.db_user import (
    getPerfil,
    passwordCorrecto,
    modificarPerfil,
    buscarCanciones,
    buscarAlbumes,
    buscarArtistas,
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
    reproducirAlbum,
    reproducirArtista,
    reproducirAleatorio,
)
from mis3.config_s3 import guardarImagen

suscriptor_routes = Blueprint("suscriptor_routes", __name__)

@suscriptor_routes.route("/inicio", methods=["GET"])
def inicio():
    try:
        c = readCanciones()
        alb = readAlbumes()
        art = readArtistas()

        return jsonify({"canciones": c["canciones"], "albums": alb["albums"], "artistas": art["artistas"]})
    except Exception as error:
        print(error)
        return jsonify({"canciones": [], "albums": [], "artistas": []})

@suscriptor_routes.route("/perfil", methods=["POST"])
def perfil():
    try:
        id_usuario = request.json.get("id_usuario")
        perfil = getPerfil(id_usuario)
        return jsonify(perfil)
    except Exception as error:
        print(error)
        return jsonify({"imagen": "", "nombre": "", "apellido": "", "email": ""})

@suscriptor_routes.route("/modificar-perfil", methods=["POST"])
def modificar_perfil():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        imagen = data["imagen"]
        nombre = data["nombre"]
        apellido = data["apellido"]
        email = data["email"]
        password = data["password"]
        correcto = passwordCorrecto(id_usuario, hashlib.sha256(password.encode()).hexdigest())
        
        if correcto["status"]:
            result = modificarPerfil(id_usuario, nombre, apellido, email)
            if imagen != "":
                guardarImagen("usuarios/" + str(id_usuario), imagen)
                result["ok"] = True
            return jsonify(result)
        return jsonify({"ok": False}), 400
    except Exception as error:
        print(error)
        return jsonify({"ok": False}), 400

@suscriptor_routes.route("/buscar", methods=["POST"])
def buscar():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        buscar = data["buscar"]
        c = buscarCanciones(id_usuario, buscar)
        alb = buscarAlbumes(buscar)
        art = buscarArtistas(buscar)

        return jsonify({"canciones": c["canciones"], "albums": alb["albums"], "artistas": art["artistas"]})
    except Exception as error:
        print(error)
        return jsonify({"ok": False}), 400

@suscriptor_routes.route("/favorito", methods=["POST"])
def marcar_favorito():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        fav = data["fav"]
        result = favorito(id_usuario, fav)
        return jsonify(result)
    except Exception as error:
        print(error)
        return jsonify({"ok": False}), 400

@suscriptor_routes.route("/favorites", methods=["POST"])
def obtener_favoritos():
    try:
        id_usuario = request.json.get("id_usuario")
        result = getFavoritos(id_usuario)
        return jsonify(result)
    except Exception as error:
        print(error)
        return jsonify({"songs": []})

@suscriptor_routes.route("/playlist", methods=["POST"])
def crear_playlist():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        nombre = data["nombre"]
        descripcion = data["descripcion"]
        imagen = data["imagen"]
        existente = getIdPlaylist(id_usuario, nombre)
        
        if not existente["status"]:
            result = createPlaylist(id_usuario, nombre, descripcion, imagen)
            if result["status"]:
                return jsonify(result["listado_playlists"])
        return jsonify({"ok": False, "playlist": []})
    except Exception as error:
        print(error)
        return jsonify({"ok": False, "playlist": []})

@suscriptor_routes.route("/playlists", methods=["POST"])
def obtener_playlists():
    try:
        id_usuario = request.json.get("id_usuario")
        result = readPlaylists(id_usuario)
        return jsonify(result)
    except Exception as error:
        print(error)
        return jsonify({"playlist": []})

@suscriptor_routes.route("/playlist/add-song", methods=["POST"])
def agregar_cancion_a_playlist():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        id_cancion = data["id_cancion"]
        nombre_playlist = data["nombre_playlist"]
        playlist = getIdPlaylist(id_usuario, nombre_playlist)
        
        if playlist["status"]:
            result = addCancionPlaylist(id_cancion, playlist["id_playlist"])
            return jsonify(result)
        return jsonify({"songs": []})
    except Exception as error:
        print(error)
        return jsonify({"songs": []})

@suscriptor_routes.route("/playlist/delete-song", methods=["POST"])
def eliminar_cancion_de_playlist():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        id_cancion = data["id_cancion"]
        nombre_playlist = data["nombre_playlist"]
        playlist = getIdPlaylist(id_usuario, nombre_playlist)
        
        if playlist["status"]:
            result = deleteCancionPlaylist(id_cancion, playlist["id_playlist"])
            return jsonify(result)
        return jsonify({"songs": []})
    except Exception as error:
        print(error)
        return jsonify({"songs": []})

@suscriptor_routes.route("/inplaylist", methods=["POST"])
def obtener_canciones_de_playlist():
    try:
        data = request.json
        id_usuario = data["id_usuario"]
        nombre = data["nombre"]
        playlist = getIdPlaylist(id_usuario, nombre)
        
        if playlist["status"]:
            result = readCancionesPlaylist(playlist["id_playlist"])
            urlImagen = f"{prefijoBucket}Fotos/playlists/{playlist['id_playlist']}.jpg"
            return jsonify({"songs": result["canciones"], "imagen_playlist": urlImagen})
        else:
            print(f'Playlist "{nombre}" de usuario con ID {id_usuario} no encontrada.')
        return jsonify({"songs": [], "imagen_playlist": ""})
    except Exception as error:
        print(error)
        return jsonify({"songs": [], "imagen_playlist": ""})

@suscriptor_routes.route("/historial", methods=["POST"])
def obtener_historial():
    try:
        id_usuario = request.json.get("id_usuario")
        topC = getTopCanciones(id_usuario)
        topA = getTopArtistas(id_usuario)
        topAlb = getTopAlbums(id_usuario)
        historialC = getHistorial(id_usuario)
        
        return jsonify({
            "cancionesRep": topC["canciones"],
            "artistaRep": topA["artistas"],
            "albumRep": topAlb["albums"],
            "historial": historialC["canciones"]
        })
    except Exception as error:
        print(error)
        return jsonify({
            "cancionesRep": [],
            "artistaRep": [],
            "albumRep": [],
            "historial": []
        })

@suscriptor_routes.route("/reproducir", methods=["POST"])
def reproducir():
    data = request.json
    id_usuario = data["id_usuario"]
    id = data["id"]
    tipo = data["tipo"]
    try:
        if tipo == 0:
            resultArtista = getIdArtistaCancion(id)
            if resultArtista["status"]:
                result = reproducirArtista(id_usuario, resultArtista["id_artista"])
                return jsonify(result)
        elif tipo == 1:
            result = reproducirAlbum(id_usuario, id)
            return jsonify(result)
        elif tipo == 2:
            result = reproducirArtista(id_usuario, id)
            return jsonify(result)
        return jsonify({"tracks": []})
    except Exception as error:
        print(error)
        return jsonify({"tracks": []})

@suscriptor_routes.route("/reproducir-aleatorio", methods=["POST"])
def reproducir_aleatorio():
    try:
        id_usuario = request.json.get("id_usuario")
        result = reproducirAleatorio(id_usuario)
        return jsonify(result)
    except Exception as error:
        print(error)
        return jsonify({"tracks": []})
