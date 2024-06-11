FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_USER=user1
ENV MYSQL_PASSWORD=proyecto_semi
ENV MYSQL_DATABASE=db_semi1_p1
ENV TZ=America/Guatemala

# Copia el archivo SQL a la carpeta /docker-entrypoint-initdb.d/
COPY ./script.sql /docker-entrypoint-initdb.d/

# Expone el puerto MySQL
EXPOSE 3306