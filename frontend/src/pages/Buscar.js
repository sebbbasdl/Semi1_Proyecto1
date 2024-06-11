import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { useState } from "react";
import AudioPlayer from "../components/Reproductor";

const Buscar = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [canciones, setCanciones] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [tracks, setTracks] = useState([]);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  const buscarFn = () => {
    const url = `${ip}/buscar`;
    const fetchData = async () => {
      let data = { 
        buscar: buscar,
        id_usuario : localStorage.getItem("id_usuario")
       };
       console.log("datos enviados:", data)
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
          console.log("respuesta: ", res)
          setCanciones(res.canciones? res.canciones : [])
          setAlbums(res.albums? res.albums : [])
          setArtistas(res.artistas? res.artistas : [])

        });
    };
    fetchData();
  };

  const favorito = (index, id) => {
    // buscamos el id de la canción de se puso/quito de favoritos
    let favs = favoritos;
    favs[index] = !favs[index];
    setFavoritos(favs); // se actualiza los favoritos

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
          buscarFn()
        });
    };
    fetchData();
  };

  const reproducir = (id, tipo) => {
    // 0 = canción
    // 1 = album
    // 2 = artista
    const url = `${ip}/reproducir`;
      let data = { id: id, tipo: tipo};
      const fetchData = async () => {
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
            const tracksAux = res.tracks
            let tracksL = []
            for (const t of tracksAux) {
              tracksL.push(t.url)
            }
            // seteamos la cola de tracks
            setTracks(tracksL)
          });
      };
      fetchData();
  };

  return (
    <main>
      <Navegacion />

      <div class="contenido album py-5 ">
        <div class="form-group narrow-search">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="¿Qué quieres escuchar?"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={(event) => setBuscar(event.target.value)}
            />
            <button class="btn btn-primary" type="button" id="button-addon2" onClick={buscarFn}>
              <img
                class="bi pe-none me-2"
                src="https://www.liberty.edu/staging/library/wp-content/uploads/sites/193/2021/03/magnifying-glass-icon-white.png"
                alt=""
                width="25"
                height="25"
              />
            </button>
          </div>
        </div>

        <div class="container">
          <h1>Canciones</h1>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {canciones.map((c, index) => (
                    <tr>
                      <th scope="row" class="align-middle">
                        <img src={c.imagen} alt="" width="100" height="60" />
                      </th>
                      <td class="align-middle">{c.nombre}</td>
                      <td class="align-middle">{c.artista}</td>
                      <td class="align-middle">{c.duracion} mins</td>
                      <td class="text-end align-middle">
                        <div class="btn-group">
                          <button
                            type="button"
                            class={`btn btn-sm  ${
                              c.esFavorito ? "btn-success" : "btn-secondary"
                            } favorite-button`}
                            onClick={() => favorito(index, c.id)}
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
                          <button
                            type="button"
                            class="btn btn-sm"
                            onClick={() => reproducir(c.id, 0)}
                          >
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h1>Albumes</h1>
          <div class="row g-3">
            {albums.map((a) => (
              <div class="col">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" class="align-middle">
                        <img src={a.imagen} alt="" width="100" height="60" />
                      </th>
                      <th scope="col" class="align-middle">
                        {a.nombre}
                      </th>
                      <th scope="col" class="align-middle">
                        {a.artista}
                      </th>
                      <th scope="col" class="align-middle">
                        {a.descripcion}
                      </th>
                      <th scope="col" class="text-end align-middle"></th>
                      <th scope="col" class="text-end align-middle"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {albums.length !== 0 ? a.canciones.map((c) => (
                      <tr>
                        <th scope="row" class="align-middle">
                          <img
                            src={c.imagen}
                            alt=""
                            width="100"
                            height="60"
                          />
                        </th>
                        <td class="align-middle">{c.nombre}</td>
                        <td class="align-middle">{c.artista}</td>
                        <td class="align-middle">{c.duracion} mins</td>
                        <td class="text-end align-middle"></td>
                        <td class="text-end align-middle">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm"
                              onClick={() => reproducir(c.id, 1)}
                            >
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
            ))}
          </div>

          <h1>Artistas</h1>
          <div class="row g-3">
            {artistas.map((a) => (
              <div class="col">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" class="align-middle">
                        <img src={a.imagen} alt="" width="100" height="60" />
                      </th>
                      <th scope="col" class="align-middle">
                        {a.nombre}
                      </th>
                      <th scope="col" class="align-middle">
                        Nacimiento: {a.nacimiento}
                      </th>
                      <th scope="col" class="align-middle"></th>
                      <th scope="col" class="text-end align-middle"></th>
                      <th scope="col" class="text-end align-middle"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {artistas.length !== 0 ? a.canciones.map((c) => (
                      <tr>
                        <th scope="row" class="align-middle">
                          <img
                            src={c.imagen}
                            alt=""
                            width="100"
                            height="60"
                          />
                        </th>
                        <td class="align-middle">{c.nombre}</td>
                        <td class="align-middle">{c.artista}</td>
                        <td class="align-middle">{c.duracion} mins</td>
                        <td class="text-end align-middle"></td>
                        <td class="text-end align-middle">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm"
                              onClick={() => reproducir(c.id, 2)}
                            >
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
            ))}
          </div>
        </div>
      </div>
        <AudioPlayer audioTracks={tracks} />
    </main>
  );
};

export default Buscar;
