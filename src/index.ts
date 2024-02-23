import { httpServer } from './http_server';
import { wsServer } from './ws_server';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wsServer.on('connection', (connection) => {
  connection.on('message', (message: string) => {
    console.log(`message : ${message}`);
  });
});
