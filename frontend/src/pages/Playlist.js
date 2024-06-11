import React, { useState , useEffect} from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { Link } from "react-router-dom";
import AudioPlayer from "../components/Reproductor";

const Playlist = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [nombrePlaylist, setNombrePlaylist] = useState("");
  const [descripcionPlaylist, setDescripcionPlaylist] = useState("");
  const [imagenPlaylist, setImagenPlaylist] = useState(null);
  const [imagenBase64, setImagenBase64] = useState(""); // Almacenará la imagen en formato base64
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";
  
  const obtenerPlaylists = () => {
    console.log("ingreso")
    // Hacer una solicitud POST a la API para obtener las playlists
    const id_usuario = localStorage.getItem("id_usuario");
    console.log("Valor de id_usuario:", id_usuario);

    const url = `${ip}playlists`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_usuario }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("datos de playlists" , data)
        // Actualizar el estado de las playlists con los datos recibidos
        setPlaylists(data.playlist);
      })
      .catch((error) => {
        console.error("Error al obtener las playlists:", error);
      });
  };

  useEffect(() => {
    console.log("ooooo")
    obtenerPlaylists();
    console.log("eeeee")
  },[]);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleAceptar = () => {
    // Validar que se haya ingresado un nombre de playlist
    if (nombrePlaylist.trim() === "") {
      alert("Por favor ingrese un nombre de playlist.");
      return;
    }

    // Validar que se haya seleccionado una imagen
    if (!imagenBase64) {
      alert("Por favor seleccione una imagen para la playlist.");
      return;
    }

    // Crear un objeto de playlist con los datos ingresados
    const id_usuario = localStorage.getItem("id_usuario");
    const nuevaPlaylist = {
      id_usuario: parseInt(id_usuario),
      nombre: nombrePlaylist,
      descripcion: descripcionPlaylist,
      imagen: Base64Modificada(imagenBase64),
    };

    console.log('nueva Playlist', nuevaPlaylist );
    // Enviar los datos al servidor mediante una solicitud POST

    const url = `${ip}playlist`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaPlaylist),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("playlistssss ", data)
        // Actualizar el estado de las playlists con la nueva playlist creada
        setPlaylists(data.playlist);

        // Cerrar el formulario y limpiar los campos
        setMostrarFormulario(false);
        setNombrePlaylist("");
        setDescripcionPlaylist("");
        setImagenPlaylist(null);
        setImagenBase64("");
      })
      .catch((error) => {
        console.error("Error al crear la playlist:", error);
      });
  };

  const handleCancelar = () => {
    // Cerrar el formulario y limpiar los campos
    setMostrarFormulario(false);
    setNombrePlaylist("");
    setDescripcionPlaylist("");
    setImagenPlaylist(null);
  };

  const handleImagenChange = (e) => {
    const imagenSeleccionada = e.target.files[0];

    // Leer la imagen seleccionada y convertirla a base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagenBase64(event.target.result);
    };

    reader.readAsDataURL(imagenSeleccionada);
    setImagenPlaylist(imagenSeleccionada);
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
      <Navegacion />
      <div className="container contenido album py-5">
        <h1 className="title">Tu Libreria</h1>
        <button className="btn btn-primary" onClick={toggleFormulario}>
          Crear Playlist
        </button>
        {mostrarFormulario && (
          <div className="formulario-crear-playlist">
            <h2>Crear Playlist</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre de la Playlist
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Escribe el nombre de la Playlist"
                  value={nombrePlaylist}
                  onChange={(e) => setNombrePlaylist(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción de la Playlist
                </label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  rows="3"
                  placeholder="Escribe una descripción para la Playlist"
                  value={descripcionPlaylist}
                  onChange={(e) => setDescripcionPlaylist(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">
                  Imagen de la Playlist
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imagen"
                  accept="image/*"
                  onChange={handleImagenChange}
                />
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={handleAceptar}
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="row g-3">
          <div className="col">
            <table className="table table-hover">
              <tbody>
                {playlists.map((playlist, index) => (
                  <tr key={index}>
                    <td className="align-middle">
                      <img
                        src={playlist.imagen}
                        alt=""
                        width="100"
                        height="60"
                      />
                    </td>
                    <td className="align-middle centered-cell">
                      <strong>{playlist.nombre}</strong>
                      
                    </td>
                    <td className="text-end align-middle">
                      <div className="btn-group">
                        {/* Utiliza Link para navegar a InPlaylist y pasa el nombre de la playlist como parámetro */}
                        <Link
                          to={{
                            pathname: "/inplaylist",
                            search: `?nombrePlaylist=${encodeURIComponent(
                              playlist.nombre
                            )}`,
                          }}
                        >
                            
                          <button type="button" className="btn btn-sm">
                            <img
                              className="bi pe-none me-2"
                              src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                              alt=""
                              width="50"
                              height="50"
                            />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        
    </main>
  );
};

export default Playlist;
