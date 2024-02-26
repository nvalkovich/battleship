interface WinnerData {
  name: string;
  wins: number;
}

export type WinnersData = WinnerData[];

class WinnersStorage {
  private winners: WinnersData;

  constructor(data: WinnersData) {
    this.winners = data;
  }

  getWinners() {
    return this.winners;
  }

  addNewWinner(winnerName: string) {
    this.winners.push({ name: winnerName, wins: 1 });
  }

  addWin(winnerName: string) {
    const existingWinner = this.getWinnerByName(winnerName);

    if (!existingWinner) {
      return;
    }

    existingWinner.wins = existingWinner?.wins + 1;
  }

  getWinnerByName(name: string) {
    return this.winners.find((winner) => winner.name === name);
  }
}

const winners = new WinnersStorage([]);

export default winners;
