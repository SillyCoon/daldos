import { Command } from '../../model/command';
import { GameMode } from '../../model/enums/game-mode';
import { GameState } from '../../model/game-state';
import { MultiplayerOpponent } from './multiplayer';
import { SimpleAI } from './simple-ai';

export abstract class Opponent {
  abstract name: string;
  abstract order: number;
  abstract getCommandFor(state: GameState): Promise<Command>;
  abstract send(command: Command | null): Promise<void>;

  static create(mode: GameMode): Opponent | null {
    if (mode !== GameMode.Single) {
      return mode === GameMode.Multi
        ? MultiplayerOpponent.create()
        : new SimpleAI();
    } else {
      return null;
    }
  }
}
