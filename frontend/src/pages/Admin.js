import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Admin.css";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/Reproductor";

const Admin = () => {
    const navigate = useNavigate();

    const navegar = (irA) => {
        navigate(irA)
    }

  return (
    <main>
      <Navegacion />
      <div className="contenido album py-5">
            <h3>Bienvenido admin, ¿qué deseas hacer hoy?</h3>
        <div className="container d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-sm text-center">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-super"
                onClick={() => navegar("/artista")}
                // Agrega una clase personalizada "btn-super" para hacer los botones más grandes
              >
                Administrar Artistas
              </button>
            </div>
            <div className="col-sm text-center">
              <button
                type="button"
                className="btn btn-warning btn-lg btn-super"
                onClick={() => navegar("/album")}
              >
                Administrar Albums
              </button>
            </div>
            <div className="col-sm text-center">
              <button
                type="button"
                className="btn btn-success btn-lg btn-super"
                onClick={() => navegar("/cancion")}
              >
                Administrar Canciones
              </button>
            </div>
          </div>
        </div>
      </div>
      <AudioPlayer audioTracks={[]}/>
    </main>
  );
};

export default Admin;
