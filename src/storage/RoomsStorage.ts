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

  getRooms() {
    return this.rooms;
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

  getRoomByUserId(userID: string) {
    return this.rooms.find(({ roomUsers }) => {
      const userIds = roomUsers?.map((roomUser) => roomUser.index);

      return userIds?.includes(userID);
    });
  }

  deleteRoomByUsersIDs(user1: string, user2: string) {
    this.rooms = this.rooms.filter(({ roomUsers }) => {
      const roomUserIds = roomUsers.map((u) => u.index).sort();
      const userIds = [user1, user2].sort();

      return roomUserIds[0] !== userIds[0] || roomUserIds[1] !== userIds[1];
    });
  }
}

const rooms = new RoomsStorage([]);

export default rooms;
