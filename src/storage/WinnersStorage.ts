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

  addNewWinner(data: WinnerData) {
    const existingWinner = this.getWinnerByName(data.name);

    if (existingWinner) {
      existingWinner.wins += 1;
      return;
    }

    this.winners.push(data);
  }

  getWinnerByName(name: string) {
    return this.winners.find((winner) => winner.name === name);
  }
}

const winners = new WinnersStorage([]);

export default winners;
