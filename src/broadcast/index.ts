import { ReqMessage } from '../types/interfaces';
import users from '../storage/UsersStorage';
import { AttackResults, wsGameCommands, wsPlayerCommands, wsRoomCommands, wsShipsCommands } from '../types/enums';
import { WebSocket } from 'ws';
import rooms from '../storage/RoomsStorage';
import { clients } from '../app';
import {
  createRegResponse,
  createUpdateRoomResponse,
  createNewGameResponse,
  createStartGameResponse,
  createTurnResponse,
  createUpdateWinnersResponse,
  createAttackResponse,
  createFinishGameResponse,
} from './responseFactory';
import games from '../storage/GamesStorage';
import winners from '../storage/WinnersStorage';
import Player from '../models/Player';

const broadcast = (client: WebSocket, req: ReqMessage, clientID: string) => {
  switch (req.type) {
    case wsPlayerCommands.Reg:
      const { name, password } = JSON.parse(req.data.toString());
      const existingPlayer = users.isUserExist(name);

      if (!existingPlayer) {
        users.addUser({ name, password, id: clientID });
      }

      const error = existingPlayer && existingPlayer.password !== password ? 'Invlaid password' : '';

      client?.send(createRegResponse(name, error));
      client.send(createUpdateRoomResponse());
      client.send(createUpdateWinnersResponse(winners.getWinners()));

      break;
    case wsRoomCommands.CreateRoom:
      const clientName = users.getUserById(clientID)?.name;

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

      const clName = users.getUserById(clientID)?.name;

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
    case wsShipsCommands.AddShips:
      const { gameId, ships, indexPlayer } = JSON.parse(req.data.toString());

      const player = new Player({ index: indexPlayer, ships });

      if (!games.getGameById(gameId)) {
        games.createNewGame({ gameId, turn: indexPlayer, players: [player] });
      } else {
        games.addPlayerToGame(gameId, player);
      }

      const game = games.getGameById(gameId);

      if (game?.players?.length === 2) {
        const allPlayers = game.players.map((player) => player.index);
        const player = game.players.find((player) => player.index === game.turn);

        if (!player) {
          return;
        }

        const startRes = createStartGameResponse(ships, player.index);
        const turnRes = createTurnResponse(player.index);

        for (let player of allPlayers) {
          const wsClient = clients.get(player) as WebSocket;
          wsClient.send(startRes);
          wsClient.send(turnRes);
        }
      }
      break;
    case wsGameCommands.Attack:
    case wsGameCommands.RandomAttack:
      const { data } = JSON.parse(JSON.stringify(req));

      const attackData = JSON.parse(data);
      const currentGame = games.getGameById(attackData.gameId);
      const currentPlayerId = attackData.indexPlayer;

      if (!currentGame || currentPlayerId !== currentGame?.turn || !currentGame.players) {
        return;
      }

      const attackedPlayer = currentGame.players.find((player) => player.index !== currentPlayerId);

      if (!attackedPlayer) {
        return;
      }

      let attackPosition =
        req.type === wsGameCommands.RandomAttack
          ? attackedPlayer.generateRandomAttack()
          : {
              x: attackData.x,
              y: attackData.y,
            };

      const attackResult = attackedPlayer.attack(attackPosition.x, attackPosition.y);

      const attackResponse = createAttackResponse(attackPosition, currentPlayerId, attackResult);
      const nextPlayer = attackResult === AttackResults.Miss ? attackedPlayer.index : currentPlayerId;

      games.setTurn(currentGame.gameId, nextPlayer);
      const turnRes = createTurnResponse(nextPlayer);

      for (let player of currentGame.players) {
        const wsClient = clients.get(player.index) as WebSocket;
        wsClient.send(attackResponse);
      }

      if (attackedPlayer.isAllShipsKilled()) {
        const winnerName = users.getUserById(currentPlayerId)?.name;
        if (!winnerName) {
          return;
        }

        if (winners.getWinnerByName(winnerName)) {
          winners.addWin(winnerName);
        } else {
          winners.addNewWinner(winnerName);
        }

        games.finishGame(currentGame.gameId);

        for (let player of currentGame.players) {
          const wsClient = clients.get(player.index) as WebSocket;
          wsClient.send(createFinishGameResponse(currentPlayerId));
          wsClient.send(createUpdateWinnersResponse(winners.getWinners()));
        }

        rooms.deleteRoomByUsersIDs(currentPlayerId, attackedPlayer.index);
      } else {
        for (let player of currentGame.players) {
          const wsClient = clients.get(player.index) as WebSocket;
          wsClient.send(turnRes);
        }
      }

      break;
  }
};

export default broadcast;
