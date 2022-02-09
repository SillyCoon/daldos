import { RollCommand } from '../commands/roll-command';
import { CommandTypeEnum } from '../../models/game-elements/enums/command-type';
import { ActivateCommand } from '../commands/activate-command';
import { MoveCommand } from '../commands/move-command';
import { Command } from '../commands/command';
import { App } from '../app';
import { GameState } from '../game-state';
import { Opponent } from './opponent';

export class PrimitiveAI implements Opponent {
  order = 2;
  name = 'ИИ';

  send(command: Command): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  getCommandFor(app: App): Promise<Command> {
    const command = this.notSuchRandomCommand(app.currentState);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (command.type) {
          case CommandTypeEnum.Roll:
            resolve(new RollCommand(app, app.currentState));
            break;
          case CommandTypeEnum.Activate:
            resolve(
              new ActivateCommand(
                app,
                app.currentState,
                command.actionCoordinate,
              ),
            );
            break;
          case CommandTypeEnum.Move:
            resolve(
              new MoveCommand(app, app.currentState, {
                from: command.from,
                to: command.to,
              }),
            );
            break;
          default:
            throw new Error('AI error!');
        }
      }, 1000);
    });
  }

  /**
   * @deprecated use notSuchRandomCommand instead
   */
  private randomCommand(gameState: GameState) {
    const commands: any[] = gameState.getAllAvailableCommands();
    return this.shuffle(commands)[0];
  }

  private notSuchRandomCommand(gameState: GameState) {
    const commands: any[] = gameState.getAllAvailableCommands();

    const eat = CommandsHelper.getMoveCommandWithEating(commands);
    const commandThenEat = CommandsHelper.getCommandAfterWhichCanEat(
      commands,
      gameState,
    );
    const activateFigureWithSmallestCoordinate =
      CommandsHelper.getActivationCommandWithSmallestCoordinate(commands);

    const firstDefinedCommand = this.firstDefined(
      eat,
      commandThenEat,
      activateFigureWithSmallestCoordinate,
    );

    if (firstDefinedCommand) {
      return firstDefinedCommand;
    } else {
      return CommandsHelper.getFirstRandom(commands);
    }
  }

  private firstDefined<T>(...elems: T[]) {
    return elems.find((elem) => elem);
  }

  private shuffle<T>(array: T[]) {
    if (array.length <= 1) return array;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

class CommandsHelper {
  static getActivationCommandWithSmallestCoordinate(commands: any[]): any[] {
    return this.filterCommandsOfType(commands, CommandTypeEnum.Activate).sort(
      (a, b) => a.actionCoordinate.y - b.actionCoordinate.y,
    )[0];
  }

  static getMoveCommandWithEating(commands: any[]): any {
    return this.filterCommandsOfType(commands, CommandTypeEnum.Move).filter(
      (move) => move.hasFigureToEat,
    )[0];
  }

  static getFirstRandom(commands: any[]): Command {
    return this.shuffle(commands)[0];
  }

  static getCommandAfterWhichCanEat(
    commands: Command[],
    currentState: GameState,
  ) {
    const activation = this.getActivationAfterWhichCanEat(
      commands,
      currentState,
    );
    if (activation) return activation;
    return this.getMoveAfterWhichCanEat(commands, currentState);
  }

  static getActivationAfterWhichCanEat(
    commands: Command[],
    currentState: GameState,
  ) {
    const activationCommands = this.filterCommandsOfType(
      commands,
      CommandTypeEnum.Activate,
    );
    return activationCommands.filter((activation) => {
      const stateAfterActivation = currentState.activate(
        activation.actionCoordinate,
      );
      if (stateAfterActivation.hasAnyAvailableMove()) {
        return true;
      }
      return false;
    })[0];
  }

  static getMoveAfterWhichCanEat(commands: Command[], currentState: GameState) {
    const moveCommands = this.filterCommandsOfType(
      commands,
      CommandTypeEnum.Move,
    );
    return moveCommands.filter((move) => {
      const stateAfterMove = currentState.makeMove(move.from, move.to);
      if (stateAfterMove.hasAnyAvailableMove()) {
        return true;
      }
      return false;
    })[0];
  }

  private static filterCommandsOfType(commands: any[], type: CommandTypeEnum) {
    return commands.filter((command) => command.type === type);
  }

  private static shuffle(commands: any[]): any[] {
    if (commands.length <= 1) return commands;
    for (let i = commands.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [commands[i], commands[j]] = [commands[j], commands[i]];
    }
    return commands;
  }
}
