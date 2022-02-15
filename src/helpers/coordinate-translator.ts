import { Coordinate } from '../model/coordinate';
import { Size } from '../model/draw/size';

export class CoordinateTranslator {
  static translateMousePositionToGameCoordinates(
    mousePosition: Coordinate,
    size: Size,
  ): Coordinate {
    const x = translate(mousePosition.x);
    const y = translate(mousePosition.y);
    return Coordinate.fromXY(x, y);

    function translate(coord: number) {
      return Math.floor((coord - size.numerationPadding) / size.square);
    }
  }

  static translateGameCoordinatesToSquareCoordinate(
    gameCoordinate: Coordinate,
    size: Size,
  ): Coordinate {
    const x = translate(gameCoordinate.x);
    const y = translate(gameCoordinate.y);
    return Coordinate.fromXY(x, y);

    function translate(coord: number) {
      return size.numerationPadding + size.square * coord;
    }
  }
}
