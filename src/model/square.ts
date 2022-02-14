import { Coordinate } from './coordinate';
import { Figure } from './figure';

export class Square {
  figure: Figure | null;
  highlighted: boolean;
  coordinate: Coordinate;

  withFigure(figure: Figure | null): Square {
    return new Square(this.coordinate, figure, this.highlighted);
  }

  get hasFigure() {
    return !!this.figure;
  }

  get availableToMakeMove() {
    return this.highlighted;
  }

  constructor(
    coordinate: Coordinate,
    figure: Figure | null,
    highlighted = false,
  ) {
    this.coordinate = coordinate;
    this.figure = figure;
    this.highlighted = highlighted;
  }
}
