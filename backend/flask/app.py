from flask import Flask, jsonify
from flask_cors import CORS
from routes.index import auth_routes #Importar rutas
from routes.admin import admin_routes
from routes.suscriptor import suscriptor_routes

app = Flask(__name__)
# Habilita CORS (Cross-Origin Resource Sharing) para permitir solicitudes desde diferentes orígenes.
CORS(app)


# Configura el límite de tamaño de solicitud a 10 MB (10 * 1024 * 1024 bytes)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB en byte
# Agrega las rutas al servidor Flask
app.register_blueprint(auth_routes)
# Registra las rutas de administrador utilizando app
app.register_blueprint(admin_routes)
# Registra las rutas de suscriptor utilizando app
app.register_blueprint(suscriptor_routes)

# Define una ruta GET en la raíz ("/pong")
@app.route('/', methods=['GET'])
def pong():
    return jsonify(message="Estamos listos")

if __name__ == '__main__':
    # Ejecuta la aplicación Flask en el puerto 2000 (o el puerto que desees)
    app.run(host='0.0.0.0', port=2000, debug=False)


'''
pip install Flask
pip install flask-cors
pip install mysql-connector-python
pip install boto3
'''