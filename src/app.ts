import { httpServer } from './servers/http';
import { wsServer } from './servers/ws';
import broadcast from './broadcast';
import { WebSocket } from 'ws';
import games from './storage/GamesStorage';
import users from './storage/UsersStorage';
import winners from './storage/WinnersStorage';
import { createFinishGameResponse, createUpdateWinnersResponse } from './broadcast/responseFactory';
import rooms from './storage/RoomsStorage';

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
      const userGame = games.getGameByUserId(clientID);
      const userRoom = rooms.getRoomByUserId(clientID);

      if (userGame || userRoom) {
        const otherUser = userGame
          ? userGame.players?.find((player) => player.index !== clientID)
          : userRoom?.roomUsers?.find((user) => user.index !== clientID);

        if (!otherUser) {
          return;
        }

        const winnerName = users.getUserById(otherUser?.index)?.name;
        if (!winnerName) {
          return;
        }

        if (winners.getWinnerByName(winnerName)) {
          winners.addWin(winnerName);
        } else {
          winners.addNewWinner(winnerName);
        }

        if (userGame) {
          games.finishGame(userGame.gameId);
        }

        const otherClient = clients.get(otherUser.index) as WebSocket;
        otherClient.send(createFinishGameResponse(otherUser.index));
        otherClient.send(createUpdateWinnersResponse(winners.getWinners()));

        rooms.deleteRoomByUsersIDs(otherUser.index, clientID);
      }
    });
  });
};

export default startApp;
