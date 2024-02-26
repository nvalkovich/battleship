import Player from '../models/Player';

interface GameData {
  gameId: string;
  turn?: string;
  players?: Player[];
}

class GamesStorage {
  private games: GameData[];

  constructor(data: GameData[]) {
    this.games = data;
  }

  getGames() {
    return this.games;
  }

  addPlayerToGame(gameId: string, data: Player) {
    const game = this.getGameById(gameId);

    if (!game || (game.players && game.players.length > 1)) return;
    if (!game.turn) {
      game.turn = data.index;
    }

    game.players?.push(data);
  }

  createNewGame(data: GameData) {
    this.games.push(data);
  }

  getGameById(id: string) {
    return this.games.find((gameData) => gameData.gameId === id);
  }

  setTurn(gameID: string, nextPlayerID: string) {
    const game = this.getGameById(gameID);

    if (!game) {
      return;
    }

    game.turn = nextPlayerID;
  }
}

const games = new GamesStorage([]);

export default games;
