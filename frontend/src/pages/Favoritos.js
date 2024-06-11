import React, { useState, useEffect } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import AudioPlayer from "../components/Reproductor";

const Favoritos = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  //const [favoriteSongs, setFavoriteSongs] = useState([]); // Estado para almacenar las canciones favoritas
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  const recargar = () => {
    const id_usuario = localStorage.getItem("id_usuario");

    // Crea un objeto con el ID de usuario
    const requestData = {
      id_usuario: id_usuario,
    };

    const url = `${ip}favorites`; // Cambia la URL y el endpoint según tu backend

    // Realizar una solicitud POST al servidor para obtener las canciones favoritas
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData), // Envía el objeto como datos JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("datos recibidos", data)
        // Actualizar el estado con los datos de las canciones favoritas obtenidas
        setFavoriteSongs(data.songs);
      })
      .catch((error) => {
        console.error("Error al obtener las canciones favoritas:", error);
      });
  }

  const unfavorito = (id) => {

    const url = `${ip}/favorito`;
    const fetchData = async () => {
      let data = { fav: id, id_usuario: localStorage.getItem("id_usuario")};
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          recargar()
        });
    };
    fetchData();
  };
  useEffect(() => {
    // Obtén el ID del usuario desde localStorage
    recargar()
  }, []); // El array de dependencias vacío asegura que esta solicitud solo se realice una vez al montar el componente


  return (
    <main>
      <Navegacion />
      <div class="container">
        <h1>Canciones Favoritas</h1>
        <div class="row g-3">
          <div class="col">
            <table class="table table-hover">
              <tbody>
                {favoriteSongs.length !== 0 ? favoriteSongs.map((song) => (
                  <tr key={song.id}>
                    <th scope="row" class="align-middle">
                      <img
                        src={song.imagen}
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td class="align-middle">{song.nombre}</td>
                    <td class="align-middle">{song.artista}</td>
                    <td class="align-middle">{song.duracion}</td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button
                          type="button"
                          class={`btn btn-sm ${
                            "btn-success" 
                          } favorite-button`}
                          onClick={() => {unfavorito(song.id)
                          }}
                        >
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/73/73814.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm">
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )):<br></br>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Favoritos;
