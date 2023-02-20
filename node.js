const http = require('http');
const fs = require('fs');
const cors = require('cors');

const jsonData = JSON.parse(fs.readFileSync('./fotos.json', 'utf8'));

const app = http.createServer((req, res) => {
  // Habilitar CORS para todas las solicitudes
  cors()(req, res, () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(jsonData));
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
