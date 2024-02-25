interface PlayerData {
  name: string;
  password: string;
  id: string;
}

class PlayersStorage {
  private players: PlayerData[];

  constructor(data: PlayerData[]) {
    this.players = data;
  }

  getPlayers() {
    return this.players;
  }

  getPlayerById(id: string) {
    return this.players.find((playerData) => playerData.id === id);
  }

  addPlayer(player: PlayerData) {
    this.players.push(player);
  }

  isPlayerExist(name: string) {
    return this.players.find((playerData) => playerData.name === name);
  }
}

const players = new PlayersStorage([]);

export default players;
