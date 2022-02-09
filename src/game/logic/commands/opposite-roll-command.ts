import { Command } from './command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';
import { App } from '../app';
import { GameState } from '../game-state';

export class OppositeRollCommand extends Command {
  dices: number[];

  constructor(app: App, gameState: GameState, dices: number[]) {
    super(app, gameState, null);
    this.dices = dices;
  }

  runCommand(): GameState {
    return this.gameState.command(CommandTypeEnum.Roll, { dices: this.dices });
  }
}
