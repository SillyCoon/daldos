import { Color } from '../model/color';
import { Coordinate } from '../model/coordinate';
import { FieldException } from '../model/exceptions/field-exception';
import { Field } from './field';

export class FieldManipulator {
  constructor(public field: Field) {}

  activate(figureCoordinate: Coordinate, currentColor: Color): Field {
    const figure = this.field.pickFigure(figureCoordinate)?.figure;

    if (figure?.canActivatedBy(currentColor)) {
      return this.field.replaceFigure(
        figureCoordinate,
        figure.withActivated(true),
      );
    }
    return this.field;
  }

  moveFigure(from: Coordinate, to: Coordinate): Field {
    const fromSquare = this.field.findSquare(from);
    const toSquare = this.field.findSquare(to);

    if (!fromSquare || !toSquare) throw new FieldException('Неправильный ход!');

    const fromFigure = this.field.pickFigure(from)?.figure ?? null;

    return this.field.replaceFigure(from, null).replaceFigure(to, fromFigure);
  }
}
