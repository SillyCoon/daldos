import { Command } from './command.js';
import { CommandType } from '../../models/game-elements/enums/command-type.js';

export class ActivateCommand extends Command {
  _runCommand() {
    const figureCoordinate = this.actionCoordinate;
    if (figureCoordinate) {
      return this.gameState.command(CommandType.Activate, { figureCoordinate });
    }
  }
}
