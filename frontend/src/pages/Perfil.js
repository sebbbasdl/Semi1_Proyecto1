import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/Perfil.css"; // Importa el archivo CSS
import Navegacion from "../components/Navegacion";

function Perfil() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";
  const fileInputRef = useRef(null);
  console.log("PERFIL");
  let inicioExitoso = false;
  const url1 = `${ip}modificar-perfil`;
  const id_usuario = localStorage.getItem("id_usuario");
  console.log("usuario enviado", id_usuario)
  useEffect(() => {
    if (id_usuario) {
      const url = `${ip}perfil`;
      const data = { id_usuario };

      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("datos recibidos", res)
          if (res.imagen) {
            setFotoPerfil(res.imagen);
          }
          setNombre(res.nombre);
          setApellido(res.apellido);
          setemail(res.email);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  const handleModificarDatosClick = () => {
    setModoEdicion(true);
  };

  const handleGuardarDatosClick = () => {
    // Aquí puedes implementar la lógica para guardar los datos y verificar la contraseña.
    const passwordCorrecta = true; // Cambia esto según tu lógica de autenticación.

    if (passwordCorrecta) {

      setModoEdicion(false);
      const data = {
        id_usuario,
        nombre,
        apellido,
        email,
        password,
        imagen: Base64Modificada(fotoPerfil), // Agrega la imagen en formato base64
      };

      fetch(url1, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          inicioExitoso = res.exito; // true o false
        });
    } else {
      alert("Contraseña incorrecta. No se guardaron los datos.");
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFotoPerfil(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleAgregarImagenClick = () => {
    fileInputRef.current.click();
  };

  function Base64Modificada(base64String) {
    const parts = base64String.split(",");
    if (parts.length === 2) {
      return parts[1];
    } else {
      return base64String; // Devuelve la cadena original si no se encuentra una coma
    }
  }

  return (
    <main>
      <div className="contenido album py-5 ">
        <Navegacion />
        <div className="contenedor ">
          <h1>Perfil de Usuario</h1>
          {modoEdicion ? (
            <div className="form-contenedor">
              <div className="profile-picture-contenedor">
                <img
                  className="profile-picture bigger"
                  src={fotoPerfil}
                  alt="Foto de Perfil"
                />
                <button
                  className="add-button-perfi"
                  onClick={handleAgregarImagenClick}
                >
                  +
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </div>
              <div className="form-fields">
                <div className="editable-field">
                  <label>Nombre:</label>
                  <input
                    className="input-field"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="editable-field">
                  <label>Apellido:</label>
                  <input
                    className="input-field"
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </div>
                <div className="editable-field">
                  <label>Correo Electrónico:</label>
                  <input
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
                <div className="editable-field">
                  <label>Contraseña:</label>
                  <input
                    className="input-field"
                    type="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                </div>
                <button className="button" onClick={handleGuardarDatosClick}>
                  Guardar Datos
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="profile-photo">
                <img
                  className="profile-picture bigger"
                  src={fotoPerfil}
                  alt="Foto de Perfil"
                />
              </div>
              <div className="user-info">
                <div className="user-info-row">
                  <label>Nombre:</label>
                  <span>{nombre}</span>
                </div>
                <div className="user-info-row">
                  <label>Apellido:</label>
                  <span>{apellido}</span>
                </div>
                <div className="user-info-row">
                  <label>Correo Electrónico:</label>
                  <span>{email}</span>
                </div>
              </div>
              <button className="button" onClick={handleModificarDatosClick}>
                Modificar Datos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Perfil;
