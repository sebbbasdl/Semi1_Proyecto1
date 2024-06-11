import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import Login from "./pages/Login";
import Buscar from "./pages/Buscar";
import Historico from "./pages/Historico";
import Album from "./pages/Album";
import InAlbum from "./pages/inAlbum";
import Artista from "./pages/Artista";
import Cancion from "./pages/Cancion";
import Perfil from "./pages/Perfil";
import RegistroUsuario from "./pages/Registro";
import Playlist from "./pages/Playlist";
import InPlaylist from "./pages/InPlaylist";
import Admin from "./pages/Admin";
import Favoritos from "./pages/Favoritos";
import Radio from "./pages/Radio";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/inicio" element={<PaginaPrincipal />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/artista" element={<Artista />} />
          <Route path="/cancion" element={<Cancion />} />
          <Route path="/album" element={<Album />} />
          <Route path="/inalbum" element={<InAlbum />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/inplaylist" element={<InPlaylist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/radio" element={<Radio />} />
        </Routes>
      </Router>
  );
}

export default App;
