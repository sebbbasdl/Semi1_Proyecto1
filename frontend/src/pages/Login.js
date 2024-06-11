import React from "react";
import "../assets/styles/Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);
  const [showError, setShowError] = useState(false);
  const ip = 'http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/'

  const inicioSesion = (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);
    console.log(rememberme);
    if (email === "admin@admin.com") {
      if (password === "123") {
        console.log("ADMIN");
        navigate("/inicio");
        localStorage.setItem("id_usuario", 0);
        localStorage.setItem("isAdmin", 1);
      } else {
        console.log("ERROR");
        setShowError(true);
      }
    } else {
      console.log("USER");
      let inicioExitoso = false;
      const url = `${ip}/login`;
      let data = { email: email, password: password, rememberme: rememberme };
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
            console.log("res: ", res);
            inicioExitoso = res.ok; // true o false
            localStorage.setItem("id_usuario", res.id_usuario);
            if (inicioExitoso) {
              navigate("/inicio");
              localStorage.setItem("isAdmin", 0);
            } else {
              console.log("ERROR");
              setShowError(true);
            }
          });
      };
      fetchData();

      
    }
  };

  const mostrarError = (event) => {
    return (
      <div className="alert alert-dismissible alert-danger">
        <strong>Oh no!</strong> Parece ser que te has equivocado de correo o
        contraseña. Por favor, vuelve a intentarlo.
      </div>
    );
  };

  return (
    <div className="mainlogin">
    {showError && mostrarError()}
      <main class="form-signin w-100 m-auto">
        <form onSubmit={inicioSesion}>
          <img
            class="mb-4 logo"
            src="https://www.nodoughmusic.com/music/wp-content/uploads/2013/06/SoundStreanMotion.jpg"
            alt=""
            width="200"
            height="200"
          />
          <h1 class="h3 mb-3 fw-normal">Inicio de Sesión</h1>

          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(event) => setEmail(event.target.value)}
            />
            <label for="floatingInput">Correo electronico</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <label for="floatingPassword">Contraseña</label>
          </div>

          <div class="form-check text-start my-3">
            <input
              class="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
              onChange={(event) => setRememberme(event.target.checked)}
            />
            <label class="form-check-label" for="flexCheckDefault">
              Recordarme
            </label>
          </div>
          <button class="btn btn-primary w-100 py-2" type="submit">
            Iniciar sesión
          </button>
          <p className="mt-3 mb-3 text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/registro">Regístrate</Link>
          </p>
          <br />
          <br />
          <br />
          <p class="mt-5 mb-3 text-body-secondary">&copy; Grupo 9</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
