import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/PaginaPrincipal.css";
import AudioPlayer from "../components/Reproductor";
import { useEffect, useState } from "react";

const PaginaPrincipal = () => {
  const [canciones, setCanciones] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [tracks, setTracks] = useState([]);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    const url = `${ip}/inicio`;

    const fetchData = async () => {
      fetch(url)
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          setCanciones(res.canciones);
          setAlbums(res.albums);
          setArtistas(res.artistas);
        });
    };
    fetchData();
  }, []);

  const reproducir = (id, tipo) => {
    // 0 = canción
    // 1 = album
    // 2 = artista
    const url = `${ip}/reproducir`;
      let data = { id: id, tipo: tipo, id_usuario : localStorage.getItem("id_usuario")};
      console.log("envio0",data)
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
            console.log("regreso", res)
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
        <div class="container">
          <h1>Canciones</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {canciones.map((c) => (
              <div class="col">
                <div class="card shadow-sm">
                  <img
                    src={c.imagen}
                    alt=""
                    width="342"
                    height="250"
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>{c.nombre}</strong>
                      <br />
                      {c.artista}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm" onClick={ () => reproducir(c.id, 0) }>
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                      <small class="text-body-secondary">{c.duracion} min</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h1>Albumes</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {albums.map((a) => (
              <div class="col">
                <div class="card shadow-sm">
                  <img
                    src={a.imagen}
                    alt=""
                    width="342"
                    height="250"
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>{a.nombre}</strong>
                      <br />
                      {a.artista}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm" onClick={ () => reproducir(a.id, 1) }>
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h1>Artistas</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {artistas.map((a) => (
              <div class="col">
                <div class="card shadow-sm">
                  <img
                    src={a.imagen}
                    alt=""
                    width="342"
                    height="250"
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>a.nombre</strong>
                      <br />
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm" onClick={ () => reproducir(a.id, 2) }>
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AudioPlayer audioTracks={tracks} />
    </main>
  );
};

export default PaginaPrincipal;
