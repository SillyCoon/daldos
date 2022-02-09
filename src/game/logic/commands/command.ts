import { Coordinate } from '../../models/game-elements/coordinate';
import { App } from '../app';
import { GameState } from '../game-state';

export abstract class Command {
  public skippedDices: any[] = [];

  get executerColor() {
    return this.gameState.currentPlayerColor;
  }

  get executedByMe() {
    return this.executerColor === this.app.myColor;
  }

  public gameState: GameState;
  protected app: App;
  protected actionCoordinate: Coordinate | null;

  constructor(
    app: App,
    gameState: GameState,
    actionCoordinate: Coordinate | null,
  ) {
    this.app = app;
    this.gameState = gameState;
    this.actionCoordinate = actionCoordinate;
  }

  execute(): Promise<Boolean> {
    const nextState = this.runCommand();

    if (!nextState || nextState.equals(this.gameState)) {
      return Promise.resolve(false);
    }

    this.app.currentState = nextState;
    this.app.draw(nextState);

    return new Promise((resolve) => {
      if (nextState.hasAnyMove) {
        resolve(true);
      } else {
        this.app.log(
          `Нет доступных ходов для игрока ${nextState.currentPlayerColor}`,
        );
        setTimeout(() => {
          const skippedState = nextState.skipMove();
          this.skippedDices = nextState.dices;
          this.app.currentState = skippedState;
          this.app.draw(skippedState);
          resolve(false);
        }, 1000);
      }
    });
  }

  undo() {
    this.app.currentState = this.gameState;
    this.app.draw(this.gameState);
  }

  abstract runCommand(): GameState;
}
