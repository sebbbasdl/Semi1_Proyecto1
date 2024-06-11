import React, { useState, useEffect } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { useLocation, useNavigate  } from "react-router-dom";

const InAlbum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nombreAlbum = params.get("nombreAlbum");
  const artistaAlbum = params.get("nombreArtista");
  const [imagenAlbum, setImagenAlbum] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null); // Almacena el ID de la canción a eliminar
  /*const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Givenchy",
      artist: "Duki",
      duration: "3 mins",
    },
    {
      id: 2,
      title: "Givenchy2",
      artist: "Duki",
      duration: "3 mins",
    },
    {
      id: 3,
      title: "Givenchy3",
      artist: "Duki",
      duration: "3 mins",
    },
    // Agrega más canciones aquí
  ]);*/

  const [idDelete, setIdDelete] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchForm, setShowSearchForm] = useState(false); // Controla si se muestra el formulario de búsqueda
  const [songs, setSongs] = useState([]); // Inicialmente, el arreglo de canciones está vacío
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    const url = `${ip}inalbum`;
    console.log(url);
    // Crea un objeto con los datos que deseas enviar en el cuerpo de la solicitud POST

    const data1 = {
      nombre: nombreAlbum,
      artista: artistaAlbum,
    };
    console.log("data1->", data1);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("dataalbum",data)
        // Actualiza el estado con los datos de las canciones obtenidas
        setSongs(data.songs);
        setImagenAlbum(data.imagen_album);
      })
      .catch((error) => {
        console.error("Error al obtener las canciones:", error);
      });
  }, [nombreAlbum]);

  

  const handleSearch = () => {
    const id_usuario = localStorage.getItem("id_usuario");

    const data = {
      id_usuario: id_usuario,
      buscar: searchQuery,
    };

    const url = `${ip}buscar`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.canciones);
      })
      .catch((error) => {
        console.error("Error al buscar canciones:", error);
      });
  };

  const handleAddToAlbum = (songId) => {
    // Encuentra la canción seleccionada por su ID

    // Obtén el ID del usuario desde localStorage
    const id_usuario = localStorage.getItem("id_usuario");

    // Crea un objeto con los datos necesarios para agregar la canción
    const data = {
      artista: artistaAlbum,
      id_cancion: songId,
      nombre_album: nombreAlbum, // Asegúrate de que esta variable esté definida en tu componente
    };
    console.log("enviando",data)

    // Realizar una solicitud POST al backend para agregar la canción
    const url = `${ip}add-song-album`; // URL del endpoint del servidor para agregar canciones
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Envía los datos como datos JSON
    };

    fetch(url, requestOptions)
      .then((response) => {
        console.log("responsa", response)
        if (response.ok) {
          // La canción se agregó con éxito en el servidor
          // Actualiza el estado en el frontend para reflejar la adición
          return response.json(); // Parsea la respuesta JSON
        } else {
          // Manejar el error si la solicitud no fue exitosa
          console.log(response)
          console.error("Error al agregar la canción.");
          throw new Error("Error al agregar la canción");
        }
      })
      .then((updatedSongs) => {
        console.log("aver", updatedSongs);
        // Actualiza el estado con las canciones actualizadas
        setSongs(updatedSongs.songs);

        // Limpia el campo de búsqueda y los resultados
        setSearchQuery("");
        setSearchResults([]);

        // Puedes realizar alguna acción adicional si es necesario
        console.log("Canción agregada con éxito.");
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  };

  const handleDeleteClick = (songId, title) => {
    setSongToDelete(songId); // Guarda el ID de la canción a eliminar
    setShowConfirmation(true);
    setIdDelete(songId);
  };

  const handleCancelClick = () => {
    setShowConfirmation(false);
    setSongToDelete(null); // Restablece el valor de songToDelete
  };

  const handleConfirmDelete = (id_cancion) => {
    if (songToDelete !== null) {
      // Obtén el ID del usuario desde localSt
      const searchParams = new URLSearchParams(location.search);
      const nombreAlbumParam = searchParams.get("nombreAlbum");
      const id_usuario = localStorage.getItem("id_usuario");

      // Obtén el ID de la canción a eliminar y el nombre de la album

      // Crea un objeto con los datos necesarios para eliminar la canción
      const data = {
        id_cancion,
        nombre_album: nombreAlbumParam,
        artista: artistaAlbum,
      };
      console.log("ladata", data);

      // Realizar la solicitud POST al backend para eliminar la canción
      const url = `${ip}delete-song-album`; // URL del endpoint del servidor para eliminar canciones
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Envía los datos como datos JSON
      };

      fetch(url, requestOptions)
        .then((response) => {
          if (response.ok) {
            // La canción se eliminó con éxito en el servidor
            // Actualiza el estado en el frontend para reflejar la eliminación
            return response.json(); // Parsea la respuesta JSON
          } else {
            // Manejar el error si la solicitud no fue exitosa
            console.error("Error al eliminar la canción.");
            throw new Error("Error al eliminar la canción");
          }
        })
        .then((data) => {
          // Asigna el nuevo arreglo de canciones a songs
          // Recargar la página actual
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    }
  };

  const [showModifyForm, setShowModifyForm] = useState(false); // Controla si se muestra el formulario de modificación
  const [albumData, setAlbumData] = useState({
    nombre: nombreAlbum,
    descripcion: "",
    imagen: null, 
  });

  const handleModifyClick = () => {
    setShowModifyForm(true);
  };

  const handleModifyInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      // Si el campo es para la imagen, convierte la imagen a base64
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAlbumData({
            ...albumData,
            imagen: e.target.result, // Almacena la imagen como base64
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setAlbumData({
        ...albumData,
        [name]: value,
      });
    }
  };

  const handleModifyAlbum = () => {
    
    // Crear un objeto para enviar datos como JSON
    const requestData = {
      nombre_antes: nombreAlbum,
      nuevo_nombre: albumData.nombre,
      descripcion: albumData.descripcion,
      imagen: Base64Modificada(albumData.imagen), 
      artista: artistaAlbum
    };

    console.log(requestData)

    // Realizar una solicitud POST para modificar los datos del álbum
    const url = `${ip}actualizar-album`; // URL del endpoint del servidor para modificar datos del álbum
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData), // Envía los datos como JSON
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          // Los datos del álbum se modificaron con éxito en el servidor
          // Puedes realizar alguna acción adicional si es necesario
          console.log("Datos del álbum modificados con éxito.");

          // Recargar la página actual
          window.location.reload();

        } else {
          // Manejar el error si la solicitud no fue exitosa
          console.error("Error al modificar los datos del álbum.");
          throw new Error("Error al modificar los datos del álbum");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
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
      <div className="container">
        <div className="image-box">
          <img
            src={imagenAlbum}
            alt=""
            width="1300"
            height="400"
          />
        </div>
        <h1 className="title2">{nombreAlbum}</h1>

        {/* Agregar botón para mostrar el formulario de búsqueda */}
        <button
          className="btn btn-primary"
          onClick={() => setShowSearchForm(!showSearchForm)}
        >
          {showSearchForm ? "Ocultar formulario" : "Agregar canción"}
        </button>

        {/* Mostrar el formulario de búsqueda si showSearchForm es true */}
        {showSearchForm && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar canción"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toString())}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Buscar canciones
            </button>
          </div>
        )}

        {/* Mostrar resultados de búsqueda */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-3">
            <table className="table table-hover">
              <tbody>
                {searchResults.map((song) => (
                  <tr key={song.id}>
                    <th scope="row" className="align-middle">
                      <img
                        src={song.imagen} // Usa la imagen recibida en el JSON
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td className="align-middle">{song.nombre}</td>
                    <td className="align-middle">{song.artista}</td>
                    <td className="align-middle">{song.duracion}</td>
                    <td className="text-end align-middle">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddToAlbum(song.id)}
                      >
                        Agregar a la album
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => setShowModifyForm(!showModifyForm)}
        >
          {showModifyForm ? "Cancelar Modificación" : "Modificar Datos Album"}
        </button>

        {showModifyForm && (
          <div>
            <h2>Modificar Datos Album</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="nombre">Nombre (Obligatorio)</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={albumData.nombre}
                  onChange={handleModifyInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  value={albumData.descripcion}
                  onChange={handleModifyInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imagen">Imagen de portada (Obligatorio)</label>
                <input
                  type="file"
                  className="form-control"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={handleModifyInputChange}
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModifyAlbum}
              >
                Aceptar
              </button>
            </form>
          </div>
        )}

        <div className="row g-3">
          <div className="col">
            <table className="table table-hover red-background-table">
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id}>
                    <th scope="row" className="align-middle">
                      <img src={song.imagen} alt="" width="100" height="60" />
                    </th>
                    <td className="align-middle">{song.nombre}</td>
                    <td className="align-middle">{song.artista}</td>
                    <td className="align-middle">{song.duracion}</td>
                    <td className="text-end align-middle">
                      <div className="btn-group">
                        {/* Botón original */}
                        <button type="button" className="btn btn-sm">
                          <img
                            className="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDeleteClick(song.id, song.nombre)
                          }
                        >
                          Eliminar canción
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
              <p>¿Estás seguro de eliminar esta canción?</p>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete(idDelete)}
              >
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

export default InAlbum;
