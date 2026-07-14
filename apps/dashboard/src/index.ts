import * as http from 'http';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(200);
    res.end('Hello from App');
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
