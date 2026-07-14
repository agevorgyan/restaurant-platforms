#!/bin/bash
set -e

npm install esbuild @types/node tsx -D

for app in api admin dashboard customer-menu customer-order customer-kiosk; do
  node -e "
    const fs = require('fs');
    const path = 'apps/' + process.argv[1] + '/package.json';
    const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
    pkg.scripts.build = 'esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js';
    pkg.scripts.start = 'node dist/index.js';
    pkg.scripts.dev = 'tsx src/index.ts';
    fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
  " "$app"

  cat << 'EOF2' > apps/$app/src/index.ts
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
EOF2
done

npx turbo run build
