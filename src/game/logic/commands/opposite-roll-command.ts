import { Command } from './command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';
import { App } from '../app';
import { GameState } from '../game-state';
import { Dice } from '../dice';

export class OppositeRollCommand extends Command {
  dices: Dice[];

  constructor(app: App, gameState: GameState, dices: Dice[]) {
    super(app, gameState, null);
    this.dices = dices;
  }

  runCommand(): GameState {
    return this.gameState.command(CommandTypeEnum.Roll, { dices: this.dices });
  }
}
