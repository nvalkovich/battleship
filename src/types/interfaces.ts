export interface ReqMessage {
  type: string;
  data: {
    [type: string]: unknown;
  };
  id: 0;
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}
