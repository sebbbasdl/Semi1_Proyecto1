import { useState, useRef } from "react";
import photo_default from "../images/registro_default.webp";
import "../assets/styles/RegistroUsuario.css"; // Importa el archivo CSS
import { useNavigate } from "react-router-dom";

function RegistroUsuario() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [foto, setFoto] = useState(photo_default); // Para subir la foto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [showError, setShowError] = useState(false);
  const fileInputRef = useRef(null);
  const registrarUsuario = (event) => {
    event.preventDefault();

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setShowError(true);
      alert("Error! Las contraseñas no coinciden.");
      return;
    }
    if (password !== confirmPassword) {
      setShowError(true);
      alert("Error! Las contraseñas no coinciden.");
      return;
    }
  
    // Crear un objeto con los datos del usuario
    const usuario = {
      nombres,
      apellidos,
      imagen: Base64Modificada(foto),
      correo: email,
      password,
      fecha : fechaNacimiento
    };
    console.log(usuario)
  
    // Realizar la solicitud POST al servidor
    fetch("http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    })
      .then((response) => {
        if (response.ok) {
          // La solicitud fue exitosa, puedes redirigir al usuario a la página de inicio
          navigate("/inicio");
        } else {
          // La solicitud falló, maneja el error como desees (mostrar mensaje de error, etc.)
          console.error("Error al registrar usuario");
        }
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
      });
    //window.location.href = "http://localhost:3000/inicio";
    setShowError(false);
  };

  const mostrarError = () => {
    if (showError) {
      // Agrega aquí el código para mostrar un mensaje de error o validación al usuario si es necesario.
    }
  };

  const handleAgregarImagenClick = () => {
    // Abre el explorador de archivos cuando el usuario hace clic en el botón.
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64Image = fileReader.result; // Aquí está la imagen en formato base64
        setFoto(base64Image);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };
  

  function Base64Modificada(base64String) {
    const parts = base64String.split(",");
    if (parts.length === 2) {
      return parts[1];
    } else {
      return base64String; // Devuelve la cadena original si no se encuentra una coma
    }
  }
  return (
    <div className="mainlogin">
      {showError && mostrarError()}
      <main className="form-signin w-100 m-auto">
        <div className="profile-picture-container">
          <h1 className="h3 mb-3 fw-normal">Registro de Usuario</h1>

          <img
            className="profile-picture bigger"
            src={foto}
            alt="Foto de Perfil"
          />
          <button class="add-button" onClick={handleAgregarImagenClick}>
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
        <br />
        <form onSubmit={registrarUsuario}>
          <div className="container-form">
            <div className="form-floating input-container">
              <input
                type="text"
                className="form-control"
                id="nombres"
                placeholder="Nombres"
                onChange={(event) => setNombres(event.target.value)}
                value={nombres}
                required
              />
              <label htmlFor="nombres">Nombres</label>
            </div>

            <div className="form-floating input-container">
              <input
                type="text"
                className="form-control"
                id="apellidos"
                placeholder="Apellidos"
                onChange={(event) => setApellidos(event.target.value)}
                value={apellidos}
                required
              />
              <label htmlFor="apellidos">Apellidos</label>
            </div>
            <div className="form-floating input-container">
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                placeholder="Fecha de Nacimiento"
                onChange={(event) => setFechaNacimiento(event.target.value)}
                value={fechaNacimiento}
                required
              />
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            </div>

            <div className="form-floating input-container">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                required
              />
              <label htmlFor="email">Correo Electrónico</label>
            </div>
            <div className="form-floating input-container">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Contraseña"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                required
              />
              <label htmlFor="password">Contraseña</label>
            </div>

            <div className="form-floating input-container">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirmar Contraseña"
                onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword}
                required
              />
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            </div>
            <button
              className="btn btn-primary w-100 py-2 animated-button"
              type="submit"
            >
              Registrarse
            </button>
            <p className="mt-5 mb-3 text-body-secondary">&copy; Grupo 9</p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default RegistroUsuario;
