import { ShipData } from '../types/interfaces';
import Deck from './Deck';
import { AttackResults } from '../types/enums';

class Ship {
  private decks: Deck[];
  public isKilled: boolean;

  constructor(shipData: ShipData) {
    const isVertical = shipData.direction;

    let index = isVertical ? shipData.position.y : shipData.position.x;
    const fixed = isVertical ? shipData.position.x : shipData.position.y;

    this.decks = [];

    for (let i = 0; i < shipData.length; i++, index++) {
      const newDeck = new Deck(isVertical ? fixed : index, isVertical ? index : fixed);
      this.decks.push(newDeck);
    }

    this.isKilled = false;
  }

  public tryAttack(x: number, y: number): AttackResults {
    const deck = this.decks.find((deck) => deck.x === x && deck.y === y);

    if (!deck) {
      return AttackResults.Miss;
    }

    deck.isAttacked = true;

    this.isKilled = this.decks.every((d) => d.isAttacked);

    return this.isKilled ? AttackResults.Killed : AttackResults.Shot;
  }
}

export default Ship;
