const http = require('http');
const fs = require('fs');
const cors = require('cors');
const { execSync } = require('child_process');

try {
  const result = execSync('sh script.sh');
  console.log(result.toString());
} catch (error) {
  console.error(error);
}

const jsonData = JSON.parse(fs.readFileSync('./idsFotos.json', 'utf8'));

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
