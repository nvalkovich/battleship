interface PlayerData {
  name: string;
  password: string;
}

class PlayersStorage {
  private data: PlayerData[];

  constructor(data: PlayerData[]) {
    this.data = data;
  }

  getPlayers() {
    return this.data;
  }

  addPlayer(player: PlayerData) {
    this.data.push(player);
  }

  isPlayerExist(player: PlayerData) {
    return this.data.find((playerData) => playerData.name === player.name);
  }
}

const players = new PlayersStorage([]);

export default players;
