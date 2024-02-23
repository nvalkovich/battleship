import { httpServer } from './http_server';
import { wsServer } from './ws_server';
import broadcast from './broadcast';

const HTTP_PORT = 8181;

const startApp = () => {
  httpServer.listen(HTTP_PORT);
  console.log(`Start static http server on the ${HTTP_PORT} port!`);

  wsServer.on('connection', (connection) => {
    connection.on('message', (message: string) => {
      const req = JSON.parse(message);
      const res = broadcast(req);
      connection.send(res);
    });
  });
};

export default startApp;
