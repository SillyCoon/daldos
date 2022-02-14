import { Field, FieldFigure } from '../logic/field';
import { Dice } from '../logic/dice';
import { Color } from './color';
import { Command, MoveCommand, RollCommand, ActivateCommand } from './command';
import { Coordinate } from './coordinate';
import { GameStatusEnum } from './enums/game-status';
import { FieldException } from './exceptions/field-exception';

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

  canActivate(coordinate: Coordinate): boolean {
    const maybeFigure = this.field.pickFigure(coordinate);
    return (
      !!maybeFigure?.canActivatedBy(this.currentPlayerColor) && this.hasDal()
    );
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

  isSquareAvailableToMove(squareCoordinate: Coordinate): boolean {
    return !!this.possibleMovesForSelectedFigure.find(
      (move) => JSON.stringify(move) === JSON.stringify(squareCoordinate),
    );
  }

  getAllAvailableCommands(): Command[] {
    const availableMoveCommands = () => {
      const commands: Command[] = [];
      this.distances.forEach((distance) => {
        const movesForDistance: Command[] = this.field
          .getAllFiguresOfColorCanMoveOn(distance, this.currentPlayerColor)
          .map((figure) => {
            const to = this.field.getSquareByDistanceFromCurrent(
              figure.coordinate,
              distance,
              this.currentPlayerColor,
            )?.coordinate;
            const from = figure.coordinate;
            if (!to) throw new FieldException('Wrong coordinate to pick');

            const hasFigureToEat = !!this.field.pickFigure(to);
            return new MoveCommand(from, to, hasFigureToEat ?? false);
          });
        commands.push(...movesForDistance);
      });
      return commands;
    };

    const availableRollCommands = () => {
      if (!this.hasDices()) {
        return new RollCommand();
      } else {
        return null;
      }
    };

    const availableActivateCommands = () => {
      if (this.hasDal()) {
        return this.field
          .getAllFiguresCanActivate(this.currentPlayerColor)
          .map((figure) => new ActivateCommand(figure.coordinate));
      }
      return [];
    };

    const rollCommand = availableRollCommands();
    if (rollCommand) return [rollCommand];

    const commands: Command[] = [];
    commands.push(...availableActivateCommands());
    commands.push(...availableMoveCommands());

    return commands;
  }

  public selectedFigureReadyToMove(): boolean {
    const figure = this.selectedFigure;
    return !!(figure?.color === this.currentPlayerColor && figure.active);
  }

  public removeUsedDices(distance: number): number[] {
    if (distance === this.dices[0] + this.dices[1]) return [];
    const usedDiceIndex = this.dices.indexOf(distance);
    return this.dices.filter((_, i) => i !== usedDiceIndex);
  }

  public hasDal() {
    return this.dices.some((dice) => dice === Dice.dal);
  }

  public hasDices() {
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
