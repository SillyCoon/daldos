import { Command } from './command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';
import { App } from '../app';
import { GameState } from '../game-state';
import { Coordinate } from '../../models/game-elements/coordinate';

export class MoveCommand extends Command {
  from: Coordinate;

  constructor(app: App, gameState: GameState, { from, to }: {from: Coordinate, to: Coordinate}) {
    super(app, gameState, to);
    this.from = from;
  }

  runCommand() {
    const to = this.actionCoordinate;
    const from = this.from;
    if (to) {
      return this.gameState.command(CommandTypeEnum.Move, { from, to });
    }
    return this.gameState;
  }
}
