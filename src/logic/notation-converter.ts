import { Color } from '../model/color';
import { NotationEnum } from '../model/enums/notation';
import { Figure } from '../model/figure';
import { Field } from './field';
import { NewField } from './new-field';

export class NotationConverter {
  static toNotation(field: Field | NewField): string {
    let notation = '';
    field.squares.forEach((row) => {
      row.forEach((square) => {
        if (square.figure) {
          if (square.figure.isFirstPlayer) {
            notation += square.figure.isActive
              ? NotationEnum.FirstActive
              : NotationEnum.FirstPassive;
          } else {
            notation += square.figure.isActive
              ? NotationEnum.SecondActive
              : NotationEnum.SecondPassive;
          }
        } else {
          notation += NotationEnum.Empty;
        }
      });
      notation += NotationEnum.Delimiter;
    });
    return notation;
  }

  static charToFigure(c: string): Figure | null {
    let isActive: Boolean;
    let color: Color;

    switch (
      c // . после квадрата - активный
    ) {
      case NotationEnum.Empty:
        return null;
      case NotationEnum.FirstActive:
        isActive = true;
        color = 1;
        break;
      case NotationEnum.FirstPassive:
        isActive = false;
        color = 1;
        break;
      case NotationEnum.SecondActive:
        isActive = true;
        color = 2;
        break;
      case NotationEnum.SecondPassive:
        isActive = false;
        color = 2;
        break;
      default:
        throw new Error('No such notation symbol');
    }

    const figure = new Figure(color);
    if (isActive) figure.activate();

    return figure;
  }

  static initialNotation(size = 16): string {
    let firstPlayerRow = '';
    let secondPlayerRow = '';
    let middleRow = '';

    for (let i = 0; i < size; i++) {
      firstPlayerRow += NotationEnum.FirstPassive;
      secondPlayerRow += NotationEnum.SecondPassive;
      middleRow += NotationEnum.Empty;
    }
    middleRow += NotationEnum.Empty;
    return (
      firstPlayerRow +
      NotationEnum.Delimiter +
      middleRow +
      NotationEnum.Delimiter +
      secondPlayerRow
    );
  }

  static goodTest(size = 13) {
    let firstPlayerRow = '';
    let secondPlayerRow = '';
    let middleRow = '';

    for (let i = 0; i < size; i++) {
      if (i === 0 || i === 5) {
        firstPlayerRow += NotationEnum.FirstPassive;
      } else {
        firstPlayerRow += NotationEnum.Empty;
      }

      if (i === 0 || i === 5) {
        secondPlayerRow += NotationEnum.SecondPassive;
      } else {
        secondPlayerRow += NotationEnum.Empty;
      }
      middleRow += NotationEnum.Empty;
    }
    middleRow += NotationEnum.Empty;
    return (
      firstPlayerRow +
      NotationEnum.Delimiter +
      middleRow +
      NotationEnum.Delimiter +
      secondPlayerRow
    );
  }
}
