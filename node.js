const fs = require('fs');
const http = require('http');
const cors = require('cors');
const { execSync } = require('child_process');
const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require('body-parser')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Permitir solicitudes desde cualquier origen
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Guardar las fotos
/*
try {
  const result = execSync('sh script.sh');
  console.log(result.toString());
} catch (error) {
  console.error(error);
}

//Relacionar ids-parent
// Cargar los dos archivos JSON
const fotosData = fs.readFileSync('fotos.json');
const fotos = JSON.parse(fotosData);

const idsData = fs.readFileSync('idsFotos.json');
const ids = JSON.parse(idsData);

const idParent = ids.ids.map(id => {
  const foto = fotos.documents.find(foto => foto.id[0] === id[0]);
  return { "id": id[0], "parent": foto.parent[0] };
});

const idParentJson = JSON.stringify({"id-parent": idParent}, null, 2);
fs.writeFileSync('idParent.json', idParentJson);
*/

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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/', (req, res) => {
  let aportacion = req.body;

  const idsParentFile = fs.readFileSync('idParent.json');
  const idsParent = JSON.parse(idsParentFile); 

  const parent = "0000033059";

  if (parent) {
    aportacion.parent = parent;
  }
  console.log(aportacion);

  const url = `https://summa.upsa.es/json/insert.vm?_type=comment&_parent=${encodeURIComponent(aportacion.parent)}&_item=${encodeURIComponent(aportacion.id)}&_evento=${encodeURIComponent(aportacion.evento)}&_fecha=${encodeURIComponent(aportacion.fecha)}&_lugar=${encodeURIComponent(aportacion.lugar)}&_personas=${encodeURIComponent(aportacion.personas)}&_comentarios=${encodeURIComponent(aportacion.observaciones)}`;
  console.log(url);
  fs.writeFileSync('update', url);

  const result = execSync('sh update.sh');
  console.log(JSON.parse(result.toString()));
});

app.get('/comments/:id', function(req, res) {
  const url = `https://summa.upsa.es/json/select.vm?query=type:comment&length=20000`;
  console.log(url);

  fs.writeFileSync('select', url);
  execSync('sh selectComments.sh');

  const result = fs.readFileSync('selectResult.json');

  const resultString = result.toString();
  const resultJson = JSON.parse(resultString);
  const restultFilter = resultJson.documents.filter(documento => documento.item[0] === req.params.id);

  res.send(JSON.stringify(restultFilter));
});



app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
