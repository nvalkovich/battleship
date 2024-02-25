import rooms from './storage/Rooms';
import { Ship } from './types/interfaces';

export const createRegResponse = (name: string, error: string): string => {
  return JSON.stringify({
    type: 'reg',
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
    type: 'update_room',
    data: JSON.stringify(rooms.getAvialableRooms()),
    id: 0,
  });
};

export const createRoomResponse = (): string => {
  return JSON.stringify({
    type: 'update_room',
    data: JSON.stringify(rooms.getAvialableRooms()),
    id: 0,
  });
};

export const createNewGameResponse = (gameID: number, playerID: string): string => {
  return JSON.stringify({
    type: 'create_game',
    data: JSON.stringify({
      idGame: gameID,
      idPlayer: playerID,
    }),
    id: 0,
  });
};

export const createStartGameResponse = (ships: Ship[], indexPlayer: string): string => {
  return JSON.stringify({
    type: 'start_game',
    data: JSON.stringify({
      ships,
      indexPlayer,
    }),
    id: 0,
  });
};