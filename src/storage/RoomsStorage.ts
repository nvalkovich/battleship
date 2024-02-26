interface RoomData {
  roomId: string;
  roomUsers: [
    {
      name: string;
      index: string;
    },
  ];
}

class RoomsStorage {
  private rooms: RoomData[];

  constructor(data: RoomData[]) {
    this.rooms = data;
  }

  addUserToRoom(
    roomID: string,
    newUser: {
      name: string;
      index: string;
    },
  ) {
    const destRoom = this.rooms.find((room) => room.roomId === roomID);
    destRoom?.roomUsers.push(newUser);
  }

  createRoom(room: RoomData) {
    this.rooms.push(room);
  }

  getPlayersInRoom(roomID: string) {
    const room = this.rooms.find((room) => room.roomId === roomID);

    return room ? room.roomUsers.map((user) => user.index) : [];
  }

  getPlayersInAllRooms() {
    const playersInRooms: string[] = [];

    this.rooms.forEach((room) => {
      const ids = this.getPlayersInRoom(room.roomId);
      ids.forEach((id) => {
        playersInRooms.push(id);
      });
    });

    return playersInRooms;
  }

  getPlayersInGame() {
    const playersInGame: string[] = [];
    this.rooms.forEach((room) => {
      if (room.roomUsers.length > 1) {
        const ids = this.getPlayersInRoom(room.roomId);

        ids.forEach((id) => {
          playersInGame.push(id);
        });
      }
    });

    return playersInGame;
  }

  getAvialableRooms() {
    const usersInGame = this.getPlayersInGame();
    return this.rooms.filter(
      (room) => room.roomUsers.length === 1 && room.roomUsers.every((user) => !usersInGame.includes(user.index)),
    );
  }

  isRoomExist(roomId: string) {
    return this.rooms.find((room) => room.roomId === roomId);
  }

  isUserInRoom(userID: string) {
    const allUsersInRoom = this.getPlayersInAllRooms();
    return allUsersInRoom.includes(userID);
  }
}

const rooms = new RoomsStorage([]);

export default rooms;
