// Instrucciones sacadas de https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

// Ponemos la contraseña de nuestra cuenta de la Api OpenWeather
const apiKey = "dde295d75568b63713ddfd0af05df2cd";

// Permitir al servidor entrar en la carpeta public de nuestro directorio
app.use(express.static("public"));

// Hemos instalado un middleware body-parser que nos permite hacer uso del objeto del req.body
app.use(bodyParser.urlencoded({ extended: true }));
// Queremos que lo que muestre sea un archivo HTML, por lo que tenemos que usar ejs y crear un archivo ejs, instalamos el módulo ejs
app.set("view engine", "ejs");

// Envíamos al cliente sea el archivo index, que como es un ejs necesita renderizar, por eso no se pone res.send sino res.render
app.get("/", function (req, res) {
  res.render('index', {weather: null, error: null});
});

app.post("/", function (req, res) {
  let ciudad = req.body.city;
  // Esta es la url de la API que nos va a dar la temperatura
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${apiKey}`;
  
  request(url, function (err, response, body) {
    if (err) {
      res.render("index", {
        weather: null,
        error: "Error, por favor, inténtalo otra vez",
      });
    } else {
      let weather = JSON.parse(body);
      //Comprobamos que la ciudad exista
      if (weather.main == undefined) {
        res.render("index", {
          weather: null,
          error: "Error, lo que has escrito no es una ciudad",
        });
        // Y en caso de que exista, enviamos el mensaje
      } else {
        let fecha=new Date()
        let meses=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let numMes=fecha.getMonth();
        let weatherText = `En ${weather.name} a ${fecha.getDate()} de ${meses[numMes]} hay ahora mismo ${weather.main.temp} ºC!`;
        res.render("index", { weather: weatherText, error: null });
      }
    }
  });
});

// Creamos un listen para decirle que tiene que escuchar el puerto 3000
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

// let london={
//         "coord":{"lon":-0.13,"lat":51.51},
//         "weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],
//         "base":"stations",
//         "main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},
//         "visibility":10000,
//         "wind":{"speed":4.1,"deg":80},
//         "clouds":{"all":90},
//         "dt":1485789600,
//         "sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},
//         "id":2643743,
//         "name":"London",
//         "cod":200}