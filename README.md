# Desafio de plub

Contiene el contenedor de nodeJS/express y de mongodb

## Los Ejercicios

**Los ejercicios se encuentra dentro de la carpeta ejercicios con una pequeña explicacion como realize el ejercicio**

## Run

```
docker-compose up
```

Va a inicializar y correr los dos contenedores de MongoDB y nodeJS

**El contenedor de NodeJS** se encuentra conectado **al de MongoDB**.

## Coleccion Postman

**La coleccion de postman se encuentra dentro de la carpeta se llama coleccion Postman/Desafio Plub.postman_collection.json**

**La app va a correr en el http://localhost:9090**

## OBSERVACION

**Tiene tambien incluido la sesion que se persiste en la base de datos**

**para realizar las comparaciones de contraseña y el hash tuve que usar bcryptjs debido que al realizar el comando de docker-compose la libreria de bcrypt me dio problemas**
