const fs = require('fs');
const http = require('http');
const cors = require('cors');
const { execSync } = require('child_process');
const express = require('express');
const path = require('path');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Permitir solicitudes desde cualquier origen
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Guardar las fotos
/*try {
  const result = Syncexec('sh script.sh');
  console.log(result.toString());
} catch (error) {
  console.error(error);
}*/

const jsonData = JSON.parse(fs.readFileSync('./idsFotos.json', 'utf8'));



app.use(cors());

// Manda el json con la lista de fotos
app.get('/fotos', (req, res) => {
  res.json(jsonData);
});

// Ruta para servir las imágenes
app.get('/fotos/:nombre', function(req, res) {
  var options = {
    root: path.join(__dirname, 'fotos'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  var fileName = req.params.nombre;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  console.log(req.body); // procesar los datos del formulario

  res.send("Gracias por su colaboración");

});



app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
