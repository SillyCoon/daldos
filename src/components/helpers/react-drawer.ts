import {
  DicePresentation,
  dicePresentation,
} from '../../game/logic/draw/dice-presentation';
import { GameState } from '../../game/logic/game-state';
import { ColorScheme } from '../../game/models/draw/color-scheme';
import { Size } from '../../game/models/draw/size';
import { Figure } from '../../game/models/game-elements/figure';
import { Statistic } from '../../game/models/game-elements/statistic';

export class ReactDrawer {
  colorScheme: ColorScheme;
  size: Size = new Size();
  dice: DicePresentation;
  squareSize: number;
  fontSize: number;
  numerationPadding: number;
  context: CanvasRenderingContext2D;

  constructor(
    context: CanvasRenderingContext2D,
    colorScheme: ColorScheme,
    size: Size,
  ) {
    this.context = context;

    this.dice = dicePresentation;
    this.dice.init();

    this.squareSize = size.square;
    this.fontSize = size.fontSize;
    this.numerationPadding = size.numerationPadding;
    this.colorScheme = colorScheme;

    this.context.font = `${this.fontSize}px serif`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
  }

  draw(state: GameState, playerStatistic: Statistic) {
    this.clear();
    this.setFillColor(
      state.currentPlayerColor === 1
        ? this.colorScheme.firstPlayerColor
        : this.colorScheme.secondPlayerColor,
    );

    this.drawDices(state.dices);
    this.drawCurrentPlayerStatistics(playerStatistic);
    state.field.squares.forEach((row, x) => {
      this.drawXNumeration(`${x}`);
      row.forEach((square, y) => {
        this.context.beginPath();
        const highlighted = state.isSquareAvailableToMove(square.coordinate);
        this.drawSquare(x, y, highlighted);
        this.drawYNumeration(`${y}`);
        if (square.figure) {
          this.drawFigure(square.figure, x, y);
        }
        this.context.stroke();
      });
    });
  }

  drawVictory(state: GameState, playerStatistic: Statistic) {
    this.clear();
    this.setFillColor(
      state.currentPlayerColor === 1
        ? this.colorScheme.firstPlayerColor
        : this.colorScheme.secondPlayerColor,
    );
    playerStatistic.win = true;
    this.drawCurrentPlayerStatistics(playerStatistic);
  }

  clear() {
    this.context.clearRect(0, 0, this.size.width, this.size.height);
  }

  private drawCurrentPlayerStatistics(player: Statistic) {
    if (player) {
      let text = `Игрок: ${player.name}`;
      if (player.win) {
        text += ` победил`;
      }
      this.context.fillText(
        text,
        this.nextSquareCoordinate(7),
        this.nextSquareCoordinate(0),
      );
    }
  }

  private drawDices(dices: number[]) {
    if (dices && dices.length) {
      dices.forEach((dice, i) => {
        this.drawDice(8 + i, 2, dice);
      });
    }
  }

  private drawDice(x: number, y: number, face: number) {
    this.dice.getSprite(face).then(([cubeSprite, faceSprite]) => {
      this.context.drawImage(
        cubeSprite,
        this.nextSquareCoordinate(x),
        this.nextSquareCoordinate(y),
      );
      this.context.drawImage(
        faceSprite,
        this.nextSquareCoordinate(x),
        this.nextSquareCoordinate(y),
      );
    });
  }

  private drawSquare(x: number, y: number, highlighted = false) {
    let color = this.colorScheme.basicSquare;
    if (highlighted) {
      this.context.lineWidth = 3;
      color = this.colorScheme.highlightedSquare;
    }
    this.setStrokeColor(color);
    this.context.strokeRect(
      this.nextSquareCoordinate(x),
      this.nextSquareCoordinate(y),
      this.squareSize,
      this.squareSize,
    );
    this.context.lineWidth = 1;
  }

  private drawFigure(figure: Figure, x: number, y: number) {
    this.setFigureColor(figure);

    this.context.arc(
      this.centerOfSquare(x),
      this.centerOfSquare(y),
      15,
      0,
      Math.PI * 2,
      true,
    );
    if (figure.isActive) {
      this.context.fill();
    } else {
      this.context.stroke();
    }
  }

  private drawXNumeration(x: string) {
    this.setFillColor('blue');
    this.context.fillText(x, this.centerOfSquare(+x), this.fontSize * 1.5);
  }

  private drawYNumeration(y: string) {
    this.setFillColor('orange');
    this.context.fillText(y, this.fontSize, this.centerOfSquare(+y) + 5);
  }

  private nextSquareCoordinate(coord: number) {
    return coord * this.squareSize + this.numerationPadding;
  }

  private centerOfSquare(coord: number) {
    return this.squareSize * (coord + 0.5) + this.numerationPadding;
  }

  private setFigureColor(figure: Figure) {
    const playerColor = figure.isFirstPlayer
      ? this.colorScheme.firstPlayerColor
      : this.colorScheme.secondPlayerColor;
    this.setStrokeColor(playerColor);
    this.setFillColor(playerColor);
  }

  private setStrokeColor(color: string) {
    this.context.strokeStyle = color;
  }

  private setFillColor(color: string) {
    this.context.fillStyle = color;
  }
}
