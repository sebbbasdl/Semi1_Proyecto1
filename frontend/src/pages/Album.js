import React, { useState, useEffect } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { Link } from "react-router-dom";

const Album = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [albums, setAlbums] = useState([
    /*{
      id: 1,
      nombre: "nombreAlbum",
      descripcion: "descripcionAlbum",
      imagen: "imagenBase64",
      artista: "nombreArtista",
    }*/

  ]);
  const [nombreAlbum, setNombreAlbum] = useState("");
  const [descripcionAlbum, setDescripcionAlbum] = useState("");
  const [imagenAlbum, setImagenAlbum] = useState(null);
  const [imagenBase64, setImagenBase64] = useState("");
  const [nombreArtista, setNombreArtista] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null); 

  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    // Hacer una solicitud GET a la API para obtener los albums
    const url = `${ip}album`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("infaaao", data);
        // Actualizar el estado de los albums con los datos recibidos
        setAlbums(data.album);
      })
      .catch((error) => {
        console.error("Error al obtener los albums:", error);
      });
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleAceptar = () => {
    // Validar que se haya ingresado un nombre de album
    if (nombreAlbum.trim() === "") {
      alert("Por favor ingrese un nombre de Album.");
      return;
    }

    // Validar que se haya seleccionado una imagen
    if (!imagenBase64) {
      alert("Por favor seleccione una imagen para el Album.");
      return;
    }

    // Crear un objeto de album con los datos ingresados
    const nuevoAlbum = {
      nombre: nombreAlbum,
      descripcion: descripcionAlbum,
      imagen: Base64Modificada(imagenBase64),
      artista: nombreArtista,
    };
    console.log("sdasd", nuevoAlbum);
    // Enviar los datos al servidor mediante una solicitud POST
    const url = `${ip}crear-album`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoAlbum),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("infooooo", data);
        // Actualizar el estado de los albums con el nuevo album creado

        // Cerrar el formulario y limpiar los campos// Recargar la página actual
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al crear el Album:", error);
      });
  };

  const handleCancelar = () => {
    // Cerrar el formulario y limpiar los campos
    setMostrarFormulario(false);
    setNombreAlbum("");
    setDescripcionAlbum("");
    setImagenAlbum(null);
  };

  const handleImagenChange = (e) => {
    const imagenSeleccionada = e.target.files[0];

    // Leer la imagen seleccionada y convertirla a base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagenBase64(event.target.result);
    };

    reader.readAsDataURL(imagenSeleccionada);
    setImagenAlbum(imagenSeleccionada);
  };

  /// delete

  const handleDeleteClick = (albumId) => {
    console.log(albumId)
    setAlbumToDelete(albumId); 
    setShowConfirmation(true); 
  };

  const handleCancelClick = () => {
    setShowConfirmation(false); 
    setAlbumToDelete(null);
  };

  const handleConfirmDelete = () => {
    console.log(albumToDelete)
    if (albumToDelete !== null) {
      
      const url = `${ip}delete-album`; 
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: albumToDelete }), 
      };

      fetch(url, requestOptions)
        .then((response) => {
          if (response.ok) {
            window.location.reload();
            setShowConfirmation(false);
            setAlbumToDelete(null);
          } else {
            // Handle error if the request was not successful
            console.error("Error deleting the album.");
          }
        })
        .catch((error) => {
          console.error("Error in the request:", error);
        });
    }
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
        <h1 className="title">Albumes </h1>
        <button className="btn btn-primary" onClick={toggleFormulario}>
          Crear Album
        </button>
        {mostrarFormulario && (
          <div className="formulario-crear-album">
            <h2>Crear Album</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre del Album
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Escribe el nombre del Album"
                  value={nombreAlbum}
                  onChange={(e) => setNombreAlbum(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción del Album
                </label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  rows="3"
                  placeholder="Escribe una descripción para el Album"
                  value={descripcionAlbum}
                  onChange={(e) => setDescripcionAlbum(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">
                  Imagen del Album
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
                <label htmlFor="nombreArtista" className="form-label">
                  Nombre del Artista
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreArtista"
                  placeholder="Escribe el nombre del Artista"
                  value={nombreArtista}
                  onChange={(e) => setNombreArtista(e.target.value)}
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
                {albums.map((album, index) => (
                  <tr key={index}>
                    <td className="align-middle">
                      <img src={album.imagen} alt="" width="100" height="60" />
                    </td>
                    <td className="align-middle centered-cell">
                      <strong>{album.nombre}</strong>
                    </td>
                    <td className="text-end align-middle">
                      <div className="btn-group">
                        {/* Utiliza Link para navegar a InAlbum y pasa el nombre del Album como parAmetro */}
                        <Link
                          to={{
                            pathname: "/inalbum",
                            search: `?nombreAlbum=${encodeURIComponent(
                              album.nombre
                            )}&nombreArtista=${encodeURIComponent(
                              album.artista
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
                    <td className="text-end align-middle">
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(album.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="modal" style={{ top: "350px", left: "775px" }}>
          <div className="modal-content">
            <div className="centered-modal">
              <p>Estas seguro de eliminar este album?</p>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Aceptar
              </button>
              <button className="btn btn-secondary" onClick={handleCancelClick}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Album;
