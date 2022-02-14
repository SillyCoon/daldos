import { Coordinate } from '../model/coordinate';
import { GameStatusEnum } from '../model/enums/game-status';
import { Dice } from './dice';
import { GameState } from '../model/game-state';

export class StateManipulator {
  constructor(private state: GameState) {}

  roll(externalDices?: number[]): GameState {
    if (!this.state.hasDices()) {
      const rolledDices = externalDices
        ? externalDices
        : [Dice.roll(), Dice.roll()];

      if (Dice.hasDoubleDal(...rolledDices)) {
        rolledDices.push(Dice.roll(), Dice.roll());
      }

      const nextState = new GameState(
        this.state.field,
        {
          color: this.state.currentPlayerColor,
          dices: rolledDices,
          selectedFigure: null,
        },
        this.state.status,
      );
      return nextState;
    } else {
      return this.state;
    }
  }

  activate(figureCoordinate: Coordinate): GameState {
    if (this.state.hasDal()) {
      const changedField = this.state.field.activate(
        figureCoordinate,
        this.state.currentPlayerColor,
      );
      if (changedField === this.state.field) return this.state;
      const remainingDices = this.state.removeUsedDices(Dice.dal);
      const nextPlayerColor = remainingDices.length
        ? this.state.currentPlayerColor
        : this.state.oppositePlayerColor;
      const status = this.state.status;
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
      return this.state;
    }
  }

  makeMove(from: Coordinate, to: Coordinate): GameState {
    const movedField = this.state.field.moveFigure(from, to);
    const moveDistance = this.state.field.distance(from, to);
    const remainingDices = this.state.removeUsedDices(moveDistance);
    const nextPlayerColor = remainingDices.length
      ? this.state.currentPlayerColor
      : this.state.oppositePlayerColor;
    const status = movedField.onlyOneFigureOfColor(nextPlayerColor)
      ? this.state.currentPlayerColor === 1
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

  pickFigure(figureCoordinate: Coordinate): GameState {
    const selectedFigure = this.state.field.pickFigure(figureCoordinate);
    if (!selectedFigure || !selectedFigure.active) return this.state;

    selectedFigure.coordinate = figureCoordinate;

    if (
      selectedFigure &&
      selectedFigure.color === this.state.currentPlayerColor
    ) {
      return new GameState(
        this.state.field,
        {
          color: this.state.currentPlayerColor,
          dices: this.state.dices,
          selectedFigure,
        },
        this.state.status,
      );
    }
    return this.state;
  }

  skipMove(): GameState {
    return new GameState(
      this.state.field,
      {
        dices: [],
        color: this.state.oppositePlayerColor,
        selectedFigure: null,
      },
      this.state.status,
    );
  }
}
