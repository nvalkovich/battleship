import { httpServer } from './servers/http';
import { wsServer } from './servers/ws';
import broadcast from './broadcast';
import { WebSocket } from 'ws';

const HTTP_PORT = 8181;

export let clients = new Map<string, WebSocket>();

const startApp = () => {
  httpServer.listen(HTTP_PORT);
  console.log(`Start static http server on the ${HTTP_PORT} port!`);

  wsServer.on('connection', (connection) => {
    const clientID = Date.now().toString();
    clients.set(clientID, connection);

    connection.on('message', (message: string) => {
      const wsClient = clients.get(clientID) as WebSocket;
      const req = JSON.parse(message);
      broadcast(wsClient, req, clientID);
    });

    connection.on('close', () => {
      clients.delete(clientID);
    });
  });
};

export default startApp;
