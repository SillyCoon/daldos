import { Command } from './command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';

export class PickCommand extends Command {
  runCommand() {
    const figureCoordinate = this.actionCoordinate;
    if (figureCoordinate) {
      return this.gameState.command(CommandTypeEnum.PickFigure, { figureCoordinate });
    } else {
      return this.gameState;
    }
  }
}
