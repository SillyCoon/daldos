import { Size } from '../models/draw/size';
import { Coordinate } from '../models/game-elements/coordinate';

export class CoordinateTranslator {
  static translateMousePositionToGameCoordinates(
    mousePosition: Coordinate,
  ): Coordinate {
    const size = new Size(); // TODO: изменить!!!
    const x = translate(mousePosition.x);
    const y = translate(mousePosition.y);
    return Coordinate.fromXY(x, y);

    function translate(coord: number) {
      return Math.floor((coord - size.numerationPadding) / size.square);
    }
  }

  static translateGameCoordinatesToSquareCoordinate(
    gameCoordinate: Coordinate,
  ): Coordinate {
    const size = new Size();
    const x = translate(gameCoordinate.x);
    const y = translate(gameCoordinate.y);
    return Coordinate.fromXY(x, y);

    function translate(coord: number) {
      return size.numerationPadding + size.square * coord;
    }
  }
}
