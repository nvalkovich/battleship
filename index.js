import { httpServer } from './src/http_server/index.js';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });

wss.on (
  'connection', (connection) => {
    connection.on (
        'message', (message) => {
          console.log("message : " + message);
        }
    );
  }
);

