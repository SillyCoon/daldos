import { Command } from './command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';
import { GameState } from '../game-state';
import { App } from '../app';
import { Coordinate } from '../../models/game-elements/coordinate';

export class RollCommand extends Command {
  constructor(app: App, gameState: GameState, actionCoordinate: Coordinate | null = null) {
    super(app, gameState, actionCoordinate);
  }

  runCommand() {
    return this.gameState.command(CommandTypeEnum.Roll);
  }
}
