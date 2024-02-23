import { ReqMessage } from './types/interfaces';
import players from './Players';

const broadcast = (req: ReqMessage): string => {
  let res;

  switch (req.type) {
    case 'reg':
      const { name, password } = JSON.parse(req.data.toString());
      const existingPlayer = players.isPlayerExist({ name, password });

      if (!existingPlayer) {
        players.addPlayer({ name, password });
      }

      const error = existingPlayer && existingPlayer.password !== password ? 'Invlaid password' : '';

      res = {
        type: 'reg',
        data: JSON.stringify({
          name,
          index: Date.now(),
          error: !!error,
          errorText: error,
        }),
        id: 0,
      };

      break;
  }

  return JSON.stringify(res);
};

export default broadcast;
