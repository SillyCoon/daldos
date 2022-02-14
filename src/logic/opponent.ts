import { Command } from '../model/command';
import { GameState } from '../model/game-state';

export interface ReactOpponent {
  name: string;
  order: number;
  getCommandFor(state: GameState): Promise<Command>;
  send(command: Command | null): Promise<void>;
}
