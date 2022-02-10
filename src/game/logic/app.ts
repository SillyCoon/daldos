import { GameState } from './game-state';
import { CanvasDrawer } from './drawer';
import { ColorScheme } from '../models/draw/color-scheme';
import { Size } from '../models/draw/size';
import { RollCommand } from './commands/roll-command';
import { OppositeRollCommand } from './commands/opposite-roll-command';
import { ActivateCommand } from './commands/activate-command';
import { PickCommand } from './commands/pick-command';
import { MoveCommand } from './commands/move-command';
import { GameModeEnum } from '../models/game-elements/enums/game-mode';
import { Button } from './control/button';
import { InteractiveBoard } from './control/Interactive-board';
import { Container } from './control/container';
import { LogPane } from './control/log-pane';
import { takeWhile } from 'rxjs/operators';
import { Command } from './commands/command';
import { Opponent } from './opponent/opponent';
import { Coordinate } from '../models/game-elements/coordinate';
import { Statistic } from '../models/game-elements/statistic';

export class App {
  myName: string;
  // TODO: вычислить тип
  opponent: Opponent;
  currentState: GameState;
  size: Size;
  colorScheme: ColorScheme;
  commands: Command[];
  mode: GameModeEnum;
  board: InteractiveBoard = new InteractiveBoard(new Size());
  controlsButtons: Button[] = [];
  logger: LogPane = new LogPane();
  drawer: CanvasDrawer;

  get firstPlayerName() {
    return this.myColor === 1 ? this.myName : this.opponent.name;
  }

  get isMyTurn() {
    return this.currentState.currentPlayerColor === this.myColor;
  }

  get secondPlayerName() {
    return this.myColor === 1 ? this.opponent.name : this.myName;
  }

  get myColor() {
    if (!this.opponent) return 1;
    if (this.opponent.order === 1) {
      return 2;
    } else {
      return 1;
    }
  }

  get gameExists() {
    return this.currentState && !this.currentState.hasWinCondition;
  }

  constructor(
    container: Container,
    myName: string,
    { mode = GameModeEnum.Single },
    opponent: Opponent,
  ) {
    this.colorScheme = new ColorScheme();
    this.size = new Size();
    this.commands = [];

    this.myName = myName;
    this.mode = mode;
    this.opponent = opponent;
    this.currentState = GameState.start(this.size.fieldSize);

    this.initBoard(container, this.size);
    this.initControlsButtons(container);
    this.initLogger(container);
    this.drawer = new CanvasDrawer(this.board, this.colorScheme, this.size);
  }

  start() {
    this.currentState = GameState.start(this.size.fieldSize);
    this.toggleControlsAvailability();
    this.draw(this.currentState);
    if (!this.isMyTurn) {
      this.opponent
        .getCommandFor(this)
        .then((command) => this.executeCommand(command));
    }
  }

  private initBoard(container: Container, size: Size) {
    this.board = new InteractiveBoard(size);
    this.assignBoardHandlers();
    container.appendElement(this.board);
  }

  private initControlsButtons(container: Container) {
    const btnRoll = new Button({ name: 'Roll' });
    const btnUndo = new Button({ name: 'Undo' });
    const controlsContainer = makeControlsLayout(container);

    this.controlsButtons = [btnRoll, btnUndo];

    btnRoll
      .handleClick()
      .pipe(takeWhile(() => this.gameExists))
      .subscribe(() => this.rollDices());
    btnUndo
      .handleClick()
      .pipe(takeWhile(() => this.gameExists))
      .subscribe(() => this.undo());

    controlsContainer.append(btnRoll, btnUndo);

    function makeControlsLayout(container: Container) {
      const controlsContainer = new Container('dal-controls-container');
      const controls = new Container('dal-controls');

      controlsContainer.prepend(controls);
      container.appendElement(controlsContainer);
      return controls;
    }
  }

  private initLogger(container: Container) {
    const logger = new LogPane();
    container.appendElement(logger);
    this.logger = logger;
  }

  private assignBoardHandlers() {
    this.board
      .handleLeftClick()
      .pipe(takeWhile(() => this.gameExists))
      .subscribe((actionCoordinate) =>
        actionCoordinate ? this.pickFigure(actionCoordinate) : null,
      );
    this.board
      .handleRightClick()
      .pipe(takeWhile(() => this.gameExists))
      .subscribe((actionCoordinate) =>
        actionCoordinate ? this.move(actionCoordinate) : null,
      );
    this.board
      .handleDoubleClick()
      .pipe(takeWhile(() => this.gameExists))
      .subscribe((actionCoordinate) =>
        actionCoordinate ? this.activate(actionCoordinate) : null,
      );
  }

  private toggleControlsAvailability() {
    if (!this.opponent) return;
    if (this.isMyTurn) {
      enableControlsButtons(this.controlsButtons);
      this.board.enable();
    } else {
      disableControlsButtons(this.controlsButtons);
      this.board.disable();
    }

    function disableControlsButtons(buttons: Button[]) {
      buttons.forEach((button) => button.disable());
    }

    function enableControlsButtons(buttons: Button[]) {
      buttons.forEach((button) => button.enable());
    }
  }

  rollDices(): Promise<void> {
    return this.executeCommand(new RollCommand(this, this.currentState, null));
  }

  oppositePlayerRollDices(dices: number[]): Promise<void> {
    return this.executeCommand(
      new OppositeRollCommand(this, this.currentState, dices),
    );
  }

  pickFigure(figureCoordinate: Coordinate): Promise<void> {
    console.log('pick');
    return this.executeCommand(
      new PickCommand(this, this.currentState, figureCoordinate),
    );
  }

  activate(figureCoordinate: Coordinate): Promise<void> {
    return this.executeCommand(
      new ActivateCommand(this, this.currentState, figureCoordinate),
    );
  }

  move(to: Coordinate): Promise<void> {
    const from = this.currentState.selectedFigure?.coordinate;

    if (from)
      return this.executeCommand(
        new MoveCommand(this, this.currentState, { from, to }),
      ).then(() => {
        if (this.currentState.hasWinCondition) {
          this.showVictoryScreen();
        }
      });
    else return Promise.resolve();
  }

  undo(): Promise<void> {
    const lastCommand = this.commands.pop();
    if (lastCommand) {
      lastCommand.undo();
    }
    return new Promise((resolve) => {
      if (!this.commands.length) resolve();
    });
  }

  executeCommand(command: Command): Promise<void> {
    return command.execute().then((stateHasMove) => {
      this.toggleControlsAvailability();
      if (stateHasMove) {
        if (
          !(command instanceof RollCommand) &&
          !(command instanceof PickCommand)
        ) {
          this.commands.push(command);
        }
      }
      if (!(command instanceof PickCommand)) {
        this.handleOpponentCommand(command);
      }
    });
  }

  handleOpponentCommand(command: Command): void {
    if (command.executedByMe) {
      this.opponent.send(command).then(() => {
        if (!this.isMyTurn) {
          this.opponent.getCommandFor(this).then((command) => {
            this.executeCommand(command);
          });
        }
      });
    } else if (!this.isMyTurn) {
      this.opponent.getCommandFor(this).then((command) => {
        this.executeCommand(command);
      });
    }
  }

  playerStatistics(gameState: GameState): Statistic {
    return {
      name:
        gameState.currentPlayerColor === 1
          ? this.firstPlayerName
          : this.secondPlayerName,
      win: false,
    };
  }

  draw(state: GameState) {
    this.drawer.draw(state, this.playerStatistics(state));
  }

  log(message: any) {
    this.logger.log(message);
  }

  showVictoryScreen() {
    this.drawer.drawVictory(
      this.currentState,
      this.playerStatistics(this.currentState),
    );
  }
}
