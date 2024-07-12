class Deck {
  public x: number;
  public y: number;
  public isAttacked: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isAttacked = false;
  }
}

export default Deck;
