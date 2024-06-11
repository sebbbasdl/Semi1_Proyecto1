import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/PaginaPrincipal.css";
import AudioPlayer from "../components/Reproductor";
import { useEffect, useState } from "react";

const Radio = () => {
  const [tracks, setTracks] = useState([]);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    // 0 = canción
    // 1 = album
    // 2 = artista
    const url = `${ip}/reproducir`;
    const fetchData = async () => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          const tracksAux = res.tracks;
          let tracksL = [];
          for (const t of tracksAux) {
            tracksL.push(t.url);
          }
          // seteamos la cola de tracks
          setTracks(tracksL);
        });
    };
    fetchData();
  }, []);

  return (
    <main>
      <Navegacion />
      <div class="contenido album py-5 ">
        <div className="d-flex align-items-center justify-content-center">
          <img
            class="bi pe-none me-2"
            src="https://cdn-icons-png.flaticon.com/512/4345/4345594.png"
            alt=""
            width="500"
            height="500"
          />
        </div>
      </div>
      <AudioPlayer audioTracks={tracks} />
    </main>
  );
};

export default Radio;
