import React, { useState, useEffect } from "react";
import "../assets/styles/Navegacion.css";
import { Link } from "react-router-dom";

const Navegacion = () => {
  const [activeLink, setActiveLink] = useState(localStorage.getItem("activeLink") || "inicio");
  const isAdmin = localStorage.getItem("isAdmin") === "1";

  useEffect(() => {
    // Almacenar el valor inicial en localStorage cuando el componente se monta
    localStorage.setItem("activeLink", activeLink);
  }, [activeLink]);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    localStorage.setItem("activeLink", linkName);
  };

  const adminPanel = (event) => {
    return (
      <li>
        <Link
          to="/admin"
          className={`nav-link ${activeLink === "admin" ? "active" : ""}`}
          onClick={() => handleLinkClick("admin")}
        >
          <img
            class="bi pe-none me-2"
            src="https://icons.veryicon.com/png/o/commerce-shopping/wangdianbao-icon-monochrome/administrator-user-query-1.png"
            alt=""
            width="25"
            height="25"
          />
          Admin
        </Link>
      </li>
    );
  };

  return (
    <div className="nav-static">
      <div class="d-flex flex-nowrap mainnav">
        <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark">
          <Link
            to={`/inicio`}
            className={`d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none nav-link ${
              activeLink === "inicio" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("inicio")}
          >
            <img
              class="mb-4 logoinit"
              src="https://www.nodoughmusic.com/music/wp-content/uploads/2013/06/SoundStreanMotion.jpg"
              alt=""
              width="100"
              height="100"
            />
          </Link>
          <hr />
          <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
              <Link
                to={`/inicio`}
                className={`nav-link ${
                  activeLink === "inicio" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("inicio")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://icon-library.com/images/white-home-icon-png/white-home-icon-png-21.jpg"
                  alt=""
                  width="25"
                  height="25"
                />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/buscar"
                className={`nav-link ${
                  activeLink === "buscar" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("buscar")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://www.liberty.edu/staging/library/wp-content/uploads/sites/193/2021/03/magnifying-glass-icon-white.png"
                  alt=""
                  width="25"
                  height="25"
                />
                Buscar
              </Link>
            </li>
            <li>
              <Link
                to="/perfil"
                className={`nav-link ${
                  activeLink === "perfil" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("perfil")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://www.logista.com/etc.clientlibs/logista-corporate/clientlibs-v2/clientlib-base/resources/icons/user_white.png"
                  alt=""
                  width="25"
                  height="25"
                />
                Perfil
              </Link>
            </li>
            <li>
              <Link
                to="/playlist"
                className={`nav-link ${
                  activeLink === "playlist" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("playlist")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/music-icon-18-256.png"
                  alt=""
                  width="25"
                  height="25"
                />
                Playlist
              </Link>
            </li>
            <li>
              <Link
                to="/favoritos"
                className={`nav-link ${
                  activeLink === "favoritos" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("favoritos")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://clipart-library.com/images/6cp6RLaoi.png"
                  alt=""
                  width="25"
                  height="25"
                />
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                to="/historico"
                className={`nav-link ${
                  activeLink === "historico" ? "active" : ""
                }`}
                onClick={() => handleLinkClick("historico")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://flaticons.net/icon.php?slug_category=application&slug_icon=tab-history"
                  alt=""
                  width="25"
                  height="25"
                />
                Histórico
              </Link>
            </li>
            <li>
              <Link
                to="/radio"
                className={`nav-link ${activeLink === "radio" ? "active" : ""}`}
                onClick={() => handleLinkClick("radio")}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/rfid-signal-icon-18-256.png"
                  alt=""
                  width="25"
                  height="25"
                />
                Radio
              </Link>
            </li>
            {isAdmin && adminPanel()}            
            <li>
              <Link
                to="/login"
                className={`nav-link ${activeLink === "radio" ? "active" : ""}`}
              >
                <img
                  class="bi pe-none me-2"
                  src="https://icon-library.com/images/logout-icon-png/logout-icon-png-13.jpg"
                  alt=""
                  width="25"
                  height="25"
                />
                Cerrar sesión
              </Link>
            </li>
          </ul>
          <hr />
        </div>
        <div class="b-example-divider b-example-vr"></div>
      </div>
    </div>
  );
};

export default Navegacion;
