import { AttackResults } from './enums';

export interface ReqMessage {
  type: string;
  data: {
    [type: string]: unknown;
  };
  id: 0;
}

export interface ShipData {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface Cell {
  x: number;
  y: number;
}

export interface AttackInfo {
  position: Cell;
  currentPlayer: string;
  status: AttackResults;
}
