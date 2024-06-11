CREATE TABLE Artistas (
    id_artista       INT PRIMARY KEY AUTO_INCREMENT,
    nombre           VARCHAR(35) NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE Albumes (
    id_album       INT PRIMARY KEY AUTO_INCREMENT,
    nombre         VARCHAR(35) NOT NULL,
    descripcion    TEXT,
    id_artista     INT NOT NULL,
    FOREIGN KEY (id_artista)
        REFERENCES Artistas(id_artista)
        ON DELETE CASCADE
);

CREATE TABLE Canciones (
    id_cancion  INT PRIMARY KEY AUTO_INCREMENT,
    nombre      VARCHAR(35) NOT NULL,
    duracion    FLOAT NOT NULL,
    id_artista  INT NOT NULL,
    id_album    INT,
    FOREIGN KEY (id_artista)
        REFERENCES Artistas(id_artista)
        ON DELETE CASCADE,
    FOREIGN KEY (id_album)
        REFERENCES Albumes(id_album)
        ON DELETE SET NULL
);

CREATE TABLE Usuarios (
    id_usuario       INT PRIMARY KEY AUTO_INCREMENT,
    nombres          VARCHAR(35) NOT NULL,
    apellidos        VARCHAR(35) NOT NULL,
    correo           VARCHAR(50) NOT NULL,
    password         VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL
);

CREATE TABLE Favoritos (
    id_usuario INT NOT NULL,
    id_cancion INT NOT NULL,
    PRIMARY KEY (id_usuario, id_cancion),
    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (id_cancion)
        REFERENCES Canciones(id_cancion)
        ON DELETE CASCADE
);

CREATE TABLE Playlists (
    id_playlist   INT PRIMARY KEY AUTO_INCREMENT,
    nombre        VARCHAR(50) NOT NULL,
    descripcion   TEXT,
    id_usuario    INT NOT NULL,
    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE Playlist_canciones (
    id_playlist INT NOT NULL,
    id_cancion  INT NOT NULL,
    PRIMARY KEY (id_playlist, id_cancion),
    FOREIGN KEY (id_playlist)
        REFERENCES Playlists(id_playlist)
        ON DELETE CASCADE,
    FOREIGN KEY (id_cancion)
        REFERENCES Canciones(id_cancion)
        ON DELETE CASCADE
);

CREATE TABLE Reproducciones (
    id_reproduccion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario      INT NOT NULL,
    id_cancion      INT NOT NULL,
    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (id_cancion)
        REFERENCES Canciones(id_cancion)
        ON DELETE CASCADE
);