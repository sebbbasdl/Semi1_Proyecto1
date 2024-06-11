from flask import Blueprint, request, jsonify
import hashlib
from controller.db_user import loginUsuario, registrarUsuario, existeUsuario
from mis3.config_s3 import guardarImagen

auth_routes = Blueprint('auth_routes', __name__)


@auth_routes.route('/login', methods=['POST'])
def login():
    correo = request.json.get('email')
    password = request.json.get('password')
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        result = loginUsuario(correo, hashed_password)
        if result['status']:
            return jsonify({"ok": True, "id_usuario": result['id_usuario']})
        else:
            return jsonify({"ok": False}), 400
    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@auth_routes.route('/registro', methods=['POST'])
def registro():
    nombres = request.json.get('nombres')
    apellidos = request.json.get('apellidos')
    imagen = request.json.get('imagen')
    correo = request.json.get('correo')
    password = request.json.get('password')
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    fecha = request.json.get('fecha')

    if nombres == "" or apellidos == "" or correo == "" or imagen == "":
        return jsonify({"ok": False}), 400
    else:
        try:
            result1 = existeUsuario(correo)
            if not result1['status']:
                result = registrarUsuario(nombres, apellidos, correo, hashed_password, fecha)
                if result['status']:
                    guardarImagen('usuarios/' + str(result['id_usuario']), imagen)
                    return jsonify({"ok": True})
            return jsonify({"ok": False}), 400
        except Exception as e:
            print(e)
            return jsonify({"ok": False}), 400
