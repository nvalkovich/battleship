import { ReqMessage } from './types/interfaces';
import players from './storage/Players';
import { wsRoomCommands } from './types/enums';
import { WebSocket } from 'ws';
import rooms from './storage/Rooms';
import { clients } from './app';
import { createRegResponse, createUpdateRoomResponse, createNewGameResponse } from './responses';

const broadcast = (client: WebSocket, req: ReqMessage, clientID: string) => {
  switch (req.type) {
    case 'reg':
      const { name, password } = JSON.parse(req.data.toString());
      const existingPlayer = players.isPlayerExist(name);

      if (!existingPlayer) {
        players.addPlayer({ name, password, id: clientID });
      }

      const error = existingPlayer && existingPlayer.password !== password ? 'Invlaid password' : '';

      const regRes = createRegResponse(name, error);

      const updateRes = createUpdateRoomResponse();

      client?.send(regRes);
      client.send(updateRes);

      break;
    case wsRoomCommands.CreateRoom:
      const clientName = players.getPlayerById(clientID)?.name;

      if (clientName) {
        const roomUser = {
          name: clientName,
          index: clientID,
        };

        if (rooms.isUserInRoom(clientID)) {
          return;
        }

        rooms.createRoom({ roomId: Date.now().toString(), roomUsers: [roomUser] });

        const updateRoomRes = createUpdateRoomResponse();

        for (let client of clients.keys()) {
          const wsClient = clients.get(client) as WebSocket;
          wsClient.send(updateRoomRes);
        }
      }

      break;
    case wsRoomCommands.AddUserToRoom:
      const { indexRoom } = JSON.parse(req.data.toString());

      if (rooms.getPlayersInRoom(indexRoom).includes(clientID)) {
        return;
      }

      const clName = players.getPlayerById(clientID)?.name;

      if (clName) {
        rooms.addUserToRoom(indexRoom, { name: clName, index: clientID });
      }

      const updateRoomRes = createUpdateRoomResponse();

      for (let client of clients.keys()) {
        const wsClient = clients.get(client) as WebSocket;
        wsClient.send(updateRoomRes);
      }

      const curRoomPlayers = rooms.isRoomExist(indexRoom)?.roomUsers;
      const playerIDs = curRoomPlayers?.map((player) => player.index);
      const newGameID = Date.now();

      if (playerIDs) {
        for (let playerID of playerIDs) {
          const newGameRes = createNewGameResponse(newGameID, playerID);

          const wsClient = clients.get(playerID.toString()) as WebSocket;

          wsClient.send(newGameRes);
        }
      }

      const roomsAfterUpdate = rooms.getAvialableRooms();

      for (let client of clients.keys()) {
        const wsClient = clients.get(client) as WebSocket;
        wsClient.send(roomsAfterUpdate);
      }

      break;
  }
};

export default broadcast;
