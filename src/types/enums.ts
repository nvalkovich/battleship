export enum wsPlayerCommands {
  Reg = 'reg',
  UpdateWinners = 'update_winners',
}

export enum wsRoomCommands {
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CreateGame = 'create_game',
  UpdateRoom = 'update_room',
}

export enum wsShipsCommands {
  AddShips = 'add_ships',
  StartGame = 'start_game',
}

export enum wsGameCommands {
  Attack = 'attack',
  RandomAttack = 'randomAttack',
  Turn = 'turn',
  Finish = 'finish',
}
