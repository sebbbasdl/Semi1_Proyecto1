import React from "react";
import Navegacion from "../components/Navegacion";
import { useState, useEffect } from "react";
import AudioPlayer from "../components/Reproductor";

const Cancion = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [duracion, setDuracion] = useState("");
  const [artista, setArtista] = useState("");
  const [mp3, setMp3] = useState("");
  const [password, setPassword] = useState("");
  const [canciones, setCanciones] = useState([]);
  const [showError, setShowError] = useState(false);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    const url = `${ip}/get-canciones`;

    const fetchData = async () => {
      fetch(url)
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          setCanciones(res.canciones);
        });
    };
    fetchData();
  }, []);

  const crearCancion = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      const parts = base64Image.split(",");
      const reader2 = new FileReader();
      reader2.onload = (event) => {
        const base64Mp3 = event.target.result;
        const parts2 = base64Mp3.split(",");
        const url = `${ip}/crear-cancion`;
        const data = {
          nombre: nombre,
          imagen: parts[1], // Aquí está la imagen en formato base64
          duracion: duracion,
          artista: artista,
          mp3: parts2[1],
        };
        console.log('data', data);
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
      reader2.readAsDataURL(mp3);
    };
    reader.readAsDataURL(imagen);
  };

  const actualizarCancion = (id) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      const parts = base64Image.split(",");
      const reader2 = new FileReader();
      reader2.onload = (event) => {
        const base64Mp3 = event.target.result;
        const parts2 = base64Mp3.split(",");
        const url = `${ip}/actualizar-cancion`;
        const data = {
          id: id,
          nombre: nombre,
          imagen: parts[1], // Aquí está la imagen en formato base64
          duracion: duracion,
          artista: artista,
          mp3: parts2[1],
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
      reader2.readAsDataURL(mp3);
    };
    reader.readAsDataURL(imagen);
  };

  const eliminarCancion = (id) => {
    if (password === "123") {
      const url = `${ip}/eliminar-cancion`;
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
          <h1>Crear Cancion</h1>
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
                  Duración (en minutos)
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Ingrese la duración de la canción"
                  onChange={(event) => setDuracion(event.target.value)}
                />
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <label for="exampleInputEmail1" class="form-label mt-4">
                  Artista
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Ingrese nombre de artista"
                  onChange={(event) => setArtista(event.target.value)}
                />
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <label for="formFile" class="form-label mt-4">
                  Archivo mp3
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  onChange={(event) => setMp3(event.target.files[0])}
                />
              </div>
            </div>

            <div class="col"></div>
            <div class="col">
              <button
                type="button"
                class="btn btn-success"
                onClick={crearCancion}
              >
                Crear
              </button>
            </div>
          </div>
          <br />
          <br />
          <h1>Canciones</h1>
          <div class="row g-3">
            {canciones.map((c) => (
              <div class="col">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                      <td class="align-middle">
                        <img src={c.imagen} alt="" width="100" height="60" />
                      </td>
                      <td class="align-middle">{c.nombre}</td>
                      <td class="align-middle">{c.duracion} min</td>
                      <td class="align-middle">{c.artista}</td>
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
                                    placeholder={c.nombre}
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
                                    Duración (en minutos)
                                  </label>
                                  <input
                                    type="number"
                                    class="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Ingrese la duración de la canción"
                                    onChange={(event) =>
                                      setDuracion(event.target.value)
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
                                    Artista
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Ingrese nombre de artista"
                                    onChange={(event) =>
                                      setArtista(event.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="row g-3">
                              <div class="col">
                                <div class="form-group">
                                  <label for="formFile" class="form-label mt-4">
                                    Archivo mp3
                                  </label>
                                  <input
                                    class="form-control"
                                    type="file"
                                    id="formFile"
                                    onChange={(event) =>
                                      setMp3(event.target.files[0])
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
                                  onClick={() => actualizarCancion(c.id)}
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
                                onClick={() => eliminarCancion(c.id)}
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

export default Cancion;
