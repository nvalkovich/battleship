import { ShipData } from '../types/interfaces';
import Ship from './Ship';
import { AttackResults } from '../types/enums';

const getRandomNumbers = (size: number) => {
  const array = [...Array(size).keys()];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

interface PlayerData {
  index: string;
  ships: ShipData[];
}

class Player {
  public index: string;
  private ships: Ship[];
  private attacks: { x: number; y: number }[];

  constructor(data: PlayerData) {
    this.index = data.index;
    this.ships = data.ships.map((shipData) => new Ship(shipData));
    this.attacks = [];
  }

  getAttacks() {
    return this.attacks;
  }

  generateRandomAttack() {
    const fieldSize = 10;
    let randomAttack;

    const randomNumbers = getRandomNumbers(fieldSize ** 2);
    let index = 0;

    while (!randomAttack) {
      const number = randomNumbers[index];
      const y = Math.trunc(number / fieldSize);
      const x = number % fieldSize;
      const position = { x, y };

      if (this.attacks.find((attack) => attack.x === x && attack.y === y)) {
        index += 1;

        continue;
      }

      randomAttack = position;
    }

    return randomAttack;
  }

  public attack(x: number, y: number): AttackResults {
    this.attacks.push({ x, y });

    for (let index = 0; index < this.ships.length; index++) {
      const ship = this.ships[index];
      const result = ship.tryAttack(x, y);

      if (result !== AttackResults.Miss) {
        return result;
      }
    }

    return AttackResults.Miss;
  }
}

export default Player;
