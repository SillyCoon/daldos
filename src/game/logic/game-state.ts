import { Field, FieldFigure } from './field';
import { Dice } from './dice';
import { CommandTypeEnum } from '../models/game-elements/enums/command-type';
import { GameStatusEnum } from '../models/game-elements/enums/game-status';
import { Color } from '../models/game-elements/color';
import { FieldException } from '../models/game-elements/exceptions/field-exception';
import { Coordinate } from '../models/game-elements/coordinate';

type PlayerOptions = {
  dices: number[];
  color: Color;
  selectedFigure: FieldFigure | null;
};

export class GameState {
  field: Field;
  dices: number[];
  currentPlayerColor: Color;
  selectedFigure: FieldFigure | null;
  status: GameStatusEnum;
  color: Color = 1;

  constructor(
    field: Field,
    { dices, color, selectedFigure }: PlayerOptions,
    status: GameStatusEnum,
  ) {
    this.field = field;
    this.dices = dices;
    this.currentPlayerColor = color;
    this.selectedFigure = selectedFigure;
    this.status = status;
  }

  static start(fieldSize: number): GameState {
    const field = Field.initial(fieldSize);
    const playerOptions: PlayerOptions = {
      dices: [],
      color: 1,
      selectedFigure: null,
    };
    const status = GameStatusEnum.Playing;

    return new GameState(field, playerOptions, status);
  }

  get oppositePlayerColor(): Color {
    return this.currentPlayerColor === 1 ? 2 : 1;
  }

  get distances(): number[] {
    return this.dices.length > 1
      ? [...this.dices, this.dices[0] + this.dices[1]]
      : [...this.dices];
  }

  get possibleMovesForSelectedFigure(): Coordinate[] {
    return this.selectedFigure && this.selectedFigureReadyToMove()
      ? this.distances.flatMap((distance) => {
          const maybeCoordinate =
            this.field.getNotBlockedSquareCoordinateByDistanceFrom(
              this.selectedFigure!.coordinate,
              distance,
              this.currentPlayerColor,
            );
          return maybeCoordinate ? [maybeCoordinate] : [];
        })
      : [];
  }

  get hasWinCondition() {
    return this.field.onlyOneFigureOfColor(this.oppositePlayerColor);
  }

  get hasAnyMove() {
    return this.hasAnyAvailableMove() || this.hasDal() || !this.hasDices();
  }

  get snapshot() {
    return {
      field: this.field,
      dices: this.dices,
      currentPlayerColor: this.color,
      selectedFigure: this.selectedFigure,
      status: this.status,
    };
  }

  equals(otherState: GameState) {
    return (
      JSON.stringify(this.snapshot) === JSON.stringify(otherState.snapshot)
    );
  }

  command(
    type: CommandTypeEnum,
    params?: {
      from?: Coordinate;
      to?: Coordinate;
      figureCoordinate?: Coordinate;
      dices?: number[];
    },
  ): GameState {
    let nextState;
    switch (type) {
      case CommandTypeEnum.Move:
        if (params?.from) {
          this.selectedFigure = this.field.pickFigure(params.from);
        }
        nextState =
          this.selectedFigure && params?.to
            ? this.makeMove(this.selectedFigure.coordinate, params.to)
            : this;
        break;
      case CommandTypeEnum.Activate:
        if (params?.figureCoordinate)
          nextState = this.activate(params.figureCoordinate);
        else nextState = this;
        break;
      case CommandTypeEnum.PickFigure:
        if (params?.figureCoordinate)
          nextState = this.pickFigure(params.figureCoordinate);
        else nextState = this;
        break;
      case CommandTypeEnum.Roll:
        // TODO: серьезно подумать над разделением интерфейсов
        nextState = this.roll(params && params.dices ? params.dices : []);
        break;
      default:
        throw new Error('No such command!');
    }

    return nextState;
  }

  roll(externalDices: number[]): GameState {
    if (!this.hasDices()) {
      const rolledDices = externalDices
        ? externalDices
        : [Dice.roll(), Dice.roll()];

      if (Dice.hasDoubleDal(...rolledDices)) {
        rolledDices.push(Dice.roll(), Dice.roll());
      }

      const nextState = new GameState(
        this.field,
        {
          color: this.currentPlayerColor,
          dices: rolledDices,
          selectedFigure: null,
        },
        this.status,
      );
      return nextState;
    } else {
      return this;
    }
  }

  canActivate(coordinate: Coordinate): boolean {
    const maybeFigure = this.field.pickFigure(coordinate);
    return (
      !!maybeFigure?.canActivatedBy(this.currentPlayerColor) && this.hasDal()
    );
  }

  activate(figureCoordinate: Coordinate): GameState {
    if (this.hasDal()) {
      const changedField = this.field.activate(
        figureCoordinate,
        this.currentPlayerColor,
      );
      if (changedField === this.field) return this;
      const remainingDices = this.removeUsedDices(Dice.dal);
      const nextPlayerColor = remainingDices.length
        ? this.currentPlayerColor
        : this.oppositePlayerColor;
      const status = this.status;
      return new GameState(
        changedField,
        {
          color: nextPlayerColor,
          dices: remainingDices,
          selectedFigure: null,
        },
        status,
      );
    } else {
      return this;
    }
  }

  canPick(coordinate: Coordinate): boolean {
    const figuresCanMove = this.distances.flatMap((distance) =>
      this.field.getAllFiguresOfColorCanMoveOn(
        distance,
        this.currentPlayerColor,
      ),
    );
    return !!figuresCanMove.find((figure) =>
      figure.coordinate.equals(coordinate),
    );
  }

  pickFigure(figureCoordinate: Coordinate): GameState {
    const selectedFigure = this.field.pickFigure(figureCoordinate);
    if (!selectedFigure || !selectedFigure.active) return this;

    selectedFigure.coordinate = figureCoordinate;

    if (selectedFigure && selectedFigure.color === this.currentPlayerColor) {
      return new GameState(
        this.field,
        {
          color: this.currentPlayerColor,
          dices: this.dices,
          selectedFigure,
        },
        this.status,
      );
    }
    return this;
  }

  makeMove(from: Coordinate, to: Coordinate): GameState {
    if (this.isSquareAvailableToMove(to)) {
      const movedField = this.field.moveFigure(from, to);
      const moveDistance = this.field.distance(from, to);
      const remainingDices = this.removeUsedDices(moveDistance);
      const nextPlayerColor = remainingDices.length
        ? this.currentPlayerColor
        : this.oppositePlayerColor;
      const status = movedField.onlyOneFigureOfColor(nextPlayerColor)
        ? this.currentPlayerColor === 1
          ? GameStatusEnum.FirstWin
          : GameStatusEnum.SecondWin
        : GameStatusEnum.Playing;

      return new GameState(
        movedField,
        {
          color: nextPlayerColor,
          dices: remainingDices,
          selectedFigure: null,
        },
        status,
      );
    }

    return this;
  }

  skipMove(): GameState {
    return new GameState(
      this.field,
      { dices: [], color: this.oppositePlayerColor, selectedFigure: null },
      this.status,
    );
  }

  isSquareAvailableToMove(squareCoordinate: Coordinate): boolean {
    return !!this.possibleMovesForSelectedFigure.filter(
      (move) => JSON.stringify(move) === JSON.stringify(squareCoordinate),
    ).length;
  }

  getAllAvailableCommands(): any[] {
    const availableMoveCommands = () => {
      const commands: any[] = [];
      this.distances.forEach((distance) => {
        const movesForDistance: any[] = this.field
          .getAllFiguresOfColorCanMoveOn(distance, this.currentPlayerColor)
          .map((figure) => {
            if (!figure.coordinate) {
              throw new FieldException('ИЗМЕНИ ЭТО ПОЖАЛУЙСТА ПОТОМ!!!!');
            }
            const to = this.field.getSquareByDistanceFromCurrent(
              figure.coordinate,
              distance,
              this.currentPlayerColor,
            )?.coordinate;
            const from = figure.coordinate;
            if (!to) throw new FieldException('Wrong coordinate to pick');

            const hasFigureToEat = this.field.pickFigure(to);
            return { type: CommandTypeEnum.Move, from, to, hasFigureToEat };
          });
        commands.push(...movesForDistance);
      });
      return commands;
    };

    const availableRollCommands = () => {
      if (!this.hasDices()) {
        return { type: CommandTypeEnum.Roll };
      } else {
        return null;
      }
    };

    const availableActivateCommands = () => {
      if (this.hasDal()) {
        return this.field
          .getAllFiguresCanActivate(this.currentPlayerColor)
          .map((figure) => ({
            type: CommandTypeEnum.Activate,
            actionCoordinate: figure.coordinate,
          }));
      }
      return [];
    };

    const rollCommand = availableRollCommands();
    if (rollCommand) return [rollCommand];

    const commands = [];
    commands.push(...availableActivateCommands());
    commands.push(...availableMoveCommands());

    return commands;
  }

  private selectedFigureReadyToMove(): boolean {
    const figure = this.selectedFigure;
    return !!(figure?.color === this.currentPlayerColor && figure.active);
  }

  private removeUsedDices(distance: number): number[] {
    if (distance === this.dices[0] + this.dices[1]) return [];
    const usedDiceIndex = this.dices.indexOf(distance);
    return this.dices.filter((_, i) => i !== usedDiceIndex);
  }

  private hasDal() {
    return this.dices.some((dice) => dice === Dice.dal);
  }

  private hasDices() {
    return !!this.dices.length;
  }

  hasAnyAvailableMove(): boolean {
    return !!this.distances.find(
      (distance) =>
        !!this.field.getAnyFigureOfColorCanMoveOn(
          distance,
          this.currentPlayerColor,
        ),
    );
  }
}
