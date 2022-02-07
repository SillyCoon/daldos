import { Coordinate } from './coordinate';
import { Figure } from './figure';

export class Square {

  figure: Figure | null;
  highlighted: boolean;
  coordinate: Coordinate;

  get hasFigure() {
    return !!this.figure;
  }

  get availableToMakeMove() {
    return this.highlighted;
  }

  constructor(coordinate: Coordinate, figure: Figure, highlighted = false) {
    this.coordinate = coordinate;
    this.figure = figure;
    this.highlighted = highlighted;
  }
}
