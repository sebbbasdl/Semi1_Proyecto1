import React from "react";
import Navegacion from "../components/Navegacion";
import { useState, useEffect } from "react";
import AudioPlayer from "../components/Reproductor";

const Artista = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [fecha, setFecha] = useState("");
  const [password, setPassword] = useState("");
  const [artistas, setArtistas] = useState([]);
  const [showError, setShowError] = useState(false);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

    useEffect(() => {
        const url = `${ip}/get-artistas`;

        const fetchData = async () => {
          fetch(url)
            .then((res) => res.json())
            .catch((error) => console.error("Error:", error))
            .then((res) => {
              console.log("res: ", res);
              setArtistas(res.artistas);
            });
        };
        fetchData();
      }, []);

  const crearArtista = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      const parts = base64Image.split(",");
      const url = `${ip}/crear-artista`;
      console.log(parts[1])
      const data = {
        nombre: nombre,
        imagen: parts[1], // Aquí está la imagen en formato base64
        fecha: fecha,
      };

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
          window.location.reload();
        });
    };
    reader.readAsDataURL(imagen);
  };

  const actualizarArtista = (id) => {
    const reader = new FileReader();
    console.log("imagen", imagen)
    reader.onload = (event) => {
      console.log("enviando", "dentro")
      const base64Image = event.target.result;
      const parts = base64Image.split(",");
      const url = `${ip}/actualizar-artista`;
      const data = {
        id: id,
        nombre: nombre,
        imagen: parts[1], // Aquí está la imagen en formato base64
        fecha: fecha,
      };
      console.log("enviando", data)
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
          window.location.reload();
        });
    };
    reader.readAsDataURL(imagen);
  };

  const eliminarArtista = (id) => {
    if (password === "123") {
      const url = `${ip}/eliminar-artista`;
      const fetchData = async () => {
        let data = { id: id };
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
            window.location.reload();
          });
      };
      fetchData();
    } else {
      setShowError(true);
    }
  };

  const mostrarError = (event) => {
    return (
      <div className="alert alert-dismissible alert-danger">
        <strong>Oh no!</strong> Contraseña incorrecta, intenta de nuevo.
      </div>
    );
  };

  return (
    <main>
      <Navegacion />

      <div class="contenido album py-5 ">
        <div class="container">
          <h1>Crear Artista</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div class="col">
              <div class="form-group">
                <label for="exampleInputEmail1" class="form-label mt-4">
                  Nombre
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Ingrese nombre"
                  onChange={(event) => setNombre(event.target.value)}
                />
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <label for="formFile" class="form-label mt-4">
                  Imagen
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  onChange={(event) => setImagen(event.target.files[0])}
                />
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <label for="exampleInputEmail1" class="form-label mt-4">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Ingrese nombre"
                  onChange={(event) => setFecha(event.target.value)}
                />
              </div>
            </div>
            <div class="col">
              <button
                type="button"
                class="btn btn-success"
                onClick={crearArtista}
              >
                Crear
              </button>
            </div>
          </div>
          <br />
          <br />
          <h1>Artistas</h1>
          <div class="row g-3">
            {artistas.map((a) => (
              <div class="col">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                      <td class="align-middle">
                        <img src={a.imagen} alt="" width="100" height="60" />
                      </td>
                      <td class="align-middle">{a.nombre}</td>
                      <td class="align-middle">Nacimiento: {a.nacimiento}</td>
                      <td class="align-middle">
                        <button
                          class="btn btn-info"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#actualizar"
                          aria-controls="offcanvasExample"
                        >
                          Actualizar
                        </button>
                        <div
                          class="offcanvas offcanvas-start"
                          tabindex="-1"
                          id="actualizar"
                          aria-labelledby="offcanvasExampleLabel"
                        >
                          <div class="offcanvas-header">
                            <h5
                              class="offcanvas-title"
                              id="offcanvasExampleLabel"
                            >
                              ACTUALIZAR
                            </h5>
                            <button
                              type="button"
                              class="btn-close text-reset"
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="offcanvas-body">
                            <div class="row g-3">
                              <div class="col">
                                <div class="form-group">
                                  <label
                                    for="exampleInputEmail1"
                                    class="form-label mt-4"
                                  >
                                    Nombre
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder={a.nombre}
                                    onChange={(event) =>
                                      setNombre(event.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="row g-3">
                              <div class="col">
                                <div class="form-group">
                                  <label for="formFile" class="form-label mt-4">
                                    Imagen
                                  </label>
                                  <input
                                    class="form-control"
                                    type="file"
                                    id="formFile"
                                    onChange={(event) =>
                                      setImagen(event.target.files[0])
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="row g-3">
                              <div class="col">
                                <div class="form-group">
                                  <label
                                    for="exampleInputEmail1"
                                    class="form-label mt-4"
                                  >
                                    Fecha de Nacimiento
                                  </label>
                                  <input
                                    type="date"
                                    class="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Ingrese nombre"
                                    onChange={(event) =>
                                      setFecha(event.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <br /> <br />
                            <div class="row g-3">
                              <div class="col">
                                <button
                                  type="button"
                                  class="btn btn-success"
                                  onClick={() => actualizarArtista(a.id)}
                                >
                                  Confirmar
                                </button>
                              </div>
                            </div>
                            <div class="row g-3"></div>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle">
                        <button
                          class="btn btn-danger"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasExample"
                          aria-controls="offcanvasExample"
                        >
                          Eliminar
                        </button>
                        <div
                          class="offcanvas offcanvas-start"
                          tabindex="-1"
                          id="offcanvasExample"
                          aria-labelledby="offcanvasExampleLabel"
                        >
                          <div class="offcanvas-header">
                            <h5
                              class="offcanvas-title"
                              id="offcanvasExampleLabel"
                            >
                              CONFIRMACION
                            </h5>
                            <button
                              type="button"
                              class="btn-close text-reset"
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="offcanvas-body">
                            <div>
                              ¿Está seguro de eliminar este artista? Esta acción
                              no podrá deshacerse. <br /> Si desea continuar,
                              por favor ingrese su contraseña.
                            </div>
                            <div class="form-group">
                              <label
                                for="exampleInputPassword1"
                                class="form-label mt-4"
                              >
                                Contraseña
                              </label>
                              <input
                                type="password"
                                class="form-control"
                                id="exampleInputPassword1"
                                placeholder="Ingrese contraseña"
                                autocomplete="off"
                                onChange={(event) =>
                                  setPassword(event.target.value)
                                }
                              />
                              <br />
                              <button
                                type="button"
                                class="btn btn-warning"
                                onClick={() => eliminarArtista(a.id)}
                              >
                                Confirmar
                              </button>
                            </div>
                            <br />
                            {showError && mostrarError()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AudioPlayer audioTracks={[]}/>
    </main>
  );
};

export default Artista;
