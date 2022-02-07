import { Command } from './command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';

export class ActivateCommand extends Command {
  runCommand() {
    const figureCoordinate = this.actionCoordinate;
    if (figureCoordinate) {
      return this.gameState.command(CommandTypeEnum.Activate, { figureCoordinate });
    }
    return this.gameState;
  }
}
