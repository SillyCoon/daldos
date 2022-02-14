import { GameState } from '../../game/logic/game-state';
import { OpponentCommand } from '../model/command';

export interface ReactOpponent {
  name: string;
  order: number;
  getCommandFor(state: GameState): Promise<OpponentCommand>;
  send(command: OpponentCommand | null): Promise<void>;
}
