import { CoordinateTranslator } from './coordinate-translator';
import { CanvasClickEvent } from '../model/draw/canvas-click-event';
import { Coordinate } from '../model/coordinate';

export namespace CanvasCoordinateTranslator {
  export const canvasClickToBoardCoordinate = (
    event: CanvasClickEvent,
    fieldSize: number,
    canvasSize: DOMRect,
  ) => {
    const getMousePosition = (event: CanvasClickEvent): Coordinate => {
      return Coordinate.fromXY(
        event.clientX - (canvasSize?.left ?? 0),
        event.clientY - (canvasSize?.top ?? 0),
      );
    };

    const isValidCoordinate = ({ x, y }: Coordinate) => {
      const isValid =
        x >= 0 &&
        x < 3 &&
        y >= 0 &&
        (y < fieldSize || (x === 1 && y < fieldSize + 1));
      return isValid;
    };

    const mousePosition = getMousePosition(event);
    const translatedCoordinates =
      CoordinateTranslator.translateMousePositionToGameCoordinates(
        mousePosition,
      );
    if (isValidCoordinate(translatedCoordinates)) {
      return translatedCoordinates;
    }
    return null;
  };
}
