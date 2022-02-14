import {
  MoveCommand,
  Command,
  ActivateCommand,
  isMove,
  isActivate,
} from '../model/command';
import { GameState } from '../model/game-state';
import { ReactOpponent } from './opponent';
import { CommandExecutor } from './state-manipulator';

export class SimpleAI implements ReactOpponent {
  order = 2;
  name = 'ИИ';

  send(_: Command | null): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  getCommandFor(state: GameState): Promise<Command> {
    const command = this.notSuchRandomCommand(state);
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve(command);
      }, 1000);
    });
  }

  /**
   * @deprecated use notSuchRandomCommand instead
   */
  private randomCommand(gameState: GameState): Command {
    const commands: Command[] = gameState.getAllAvailableCommands();
    return this.shuffle(commands)[0];
  }

  private notSuchRandomCommand(gameState: GameState): Command {
    const commands: Command[] = gameState.getAllAvailableCommands();

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

  private firstDefined<T>(...elems: T[]): T | undefined {
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
  static getActivationCommandWithSmallestCoordinate(
    commands: Command[],
  ): ActivateCommand {
    return this.filterActivateCommands(commands).sort(
      (a, b) => a.coordinate.y - b.coordinate.y,
    )[0];
  }

  static getMoveCommandWithEating(commands: Command[]): MoveCommand {
    return this.filterMoveCommands(commands).filter(
      (move) => move.hasFigureToEat,
    )[0];
  }

  static getCommandAfterWhichCanEat(
    commands: Command[],
    currentState: GameState,
  ): ActivateCommand | MoveCommand {
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
  ): ActivateCommand {
    const stateManipulator = new CommandExecutor(currentState);
    const activationCommands = this.filterActivateCommands(commands);
    return activationCommands.filter((activation) => {
      const stateAfterActivation = stateManipulator.activate(
        activation.coordinate,
      );
      if (stateAfterActivation.hasAnyAvailableMove()) {
        return true;
      }
      return false;
    })[0];
  }

  static getMoveAfterWhichCanEat(
    commands: Command[],
    currentState: GameState,
  ): MoveCommand {
    const stateManipulator = new CommandExecutor(currentState);
    const moveCommands: MoveCommand[] = this.filterMoveCommands(commands);

    return moveCommands.filter((move) => {
      const stateAfterMove = stateManipulator.makeMove(move.from, move.to);
      if (stateAfterMove.hasAnyAvailableMove()) {
        return true;
      }
      return false;
    })[0];
  }

  private static filterMoveCommands(commands: Command[]): MoveCommand[] {
    return commands.filter(isMove);
  }

  private static filterActivateCommands(
    commands: Command[],
  ): ActivateCommand[] {
    return commands.filter(isActivate);
  }

  static getFirstRandom<T>(commands: T[]): T {
    return this.shuffle(commands)[0];
  }

  private static shuffle<T>(commands: T[]): T[] {
    if (commands.length <= 1) return commands;
    for (let i = commands.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [commands[i], commands[j]] = [commands[j], commands[i]];
    }
    return commands;
  }
}
