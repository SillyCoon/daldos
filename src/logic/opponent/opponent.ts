import { Command } from '../../model/command';
import { GameState } from '../../model/game-state';

export abstract class Opponent {
  abstract name: string;
  abstract order: number;
  abstract getCommandFor(state: GameState): Promise<Command>;
  abstract send(command: Command | null): Promise<void>;
}
