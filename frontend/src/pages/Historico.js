import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Historico.css";
import AudioPlayer from "../components/Reproductor";
import { useEffect, useState } from "react";

const Historico = () => {
  const [cancionesRep, setCancionesRep] = useState([]);
  const [albumRep, setAlbumRep] = useState([]);
  const [artistaRep, setArtistaRep] = useState([]);
  const [historial, setHistorial] = useState([]);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    const url = `${ip}/historial`;

    const fetchData = async () => {
      let data = { id_usuario: localStorage.getItem("id_usuario")};
      fetch(url,{
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
          setCancionesRep(res.cancionesRep);
          setAlbumRep(res.albumRep);
          setArtistaRep(res.artistaRep);
          setHistorial(res.historial);
        });
    };
    fetchData();
  }, []);

  return (
    <main>
      <Navegacion />
      <div class="contenido album py-5 ">
        <div class="container">
          <h3>Top 5 canciones más reproducidas</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {cancionesRep.map((c, index) => (
                    <tr class="table-primary">
                      <th scope="row">{index + 1}</th>
                      <td>{c.nombre}</td>
                      <td>{c.artista}</td>
                      <td>Veces reproducidas: {c.veces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3>Top 3 artistas más escuchados</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {artistaRep.map((a, index) => (
                    <tr class="table-info">
                      <th scope="row">{index + 1}</th>
                      <td>{a.nombre}</td>
                      <td></td>
                      <td>Veces reproducidas: {a.veces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3> Top 5 álbumes más reproducidos</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {albumRep.map((a, index) => (
                    <tr class="table-light">
                      <th scope="row">{index + 1}</th>
                      <td>{a.nombre}</td>
                      <td>{a.artista}</td>
                      <td>Veces reproducidas: {a.veces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3>Historial de canciones reproducidas</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {historial.map((h) => (
                    <tr class="table-secondary">
                      <td>{h.nombre}</td>
                      <td>{h.artista}</td>
                      <td>{}</td>
                      <td>{h.duracion} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AudioPlayer audioTracks={[]}/>
    </main>
  );
};

export default Historico;
