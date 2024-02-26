import rooms from '../storage/RoomsStorage';
import { WinnersData } from '../storage/WinnersStorage';
import { AttackResults, wsGameCommands, wsPlayerCommands, wsRoomCommands, wsShipsCommands } from '../types/enums';
import { Cell, ShipData } from '../types/interfaces';

export const createRegResponse = (name: string, error: string): string => {
  return JSON.stringify({
    type: wsPlayerCommands.Reg,
    data: JSON.stringify({
      name,
      index: Date.now(),
      error: !!error,
      errorText: error || '',
    }),
    id: 0,
  });
};

export const createUpdateRoomResponse = (): string => {
  return JSON.stringify({
    type: wsRoomCommands.UpdateRoom,
    data: JSON.stringify(rooms.getAvialableRooms()),
    id: 0,
  });
};

export const createNewGameResponse = (gameID: number, playerID: string): string => {
  return JSON.stringify({
    type: wsRoomCommands.CreateGame,
    data: JSON.stringify({
      idGame: gameID,
      idPlayer: playerID,
    }),
    id: 0,
  });
};

export const createStartGameResponse = (ships: ShipData[], indexPlayer: string): string => {
  return JSON.stringify({
    type: wsShipsCommands.StartGame,
    data: JSON.stringify({
      ships,
      indexPlayer,
    }),
    id: 0,
  });
};

export const createTurnResponse = (currentPlayer: string): string => {
  return JSON.stringify({
    type: wsGameCommands.Turn,
    data: JSON.stringify({
      currentPlayer,
    }),
    id: 0,
  });
};

export const createAttackResponse = (position: Cell, currentPlayer: string, status: AttackResults): string => {
  return JSON.stringify({
    type: wsGameCommands.Attack,
    data: JSON.stringify({
      position,
      currentPlayer,
      status,
    }),
    id: 0,
  });
};

export const createUpdateWinnersResponse = (winnersData: WinnersData): string => {
  return JSON.stringify({
    type: wsPlayerCommands.UpdateWinners,
    data: JSON.stringify(winnersData),
    id: 0,
  });
};

export const createFinishGameResponse = (winPlayerID: string): string => {
  return JSON.stringify({
    type: wsGameCommands.Finish,
    data: JSON.stringify(winPlayerID),
    id: 0,
  });
};
