import { CoordinateTranslator } from './coordinate-translator';
import { CanvasClickEvent } from '../model/draw/canvas-click-event';
import { Coordinate } from '../model/coordinate';
import { Size } from '../model/draw/size';

export namespace CanvasCoordinateTranslator {
  export const canvasClickToBoardCoordinate = (
    event: CanvasClickEvent,
    size: Size,
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
        (y < size.fieldSize || (x === 1 && y < size.fieldSize + 1));
      return isValid;
    };

    const mousePosition = getMousePosition(event);
    const translatedCoordinates =
      CoordinateTranslator.translateMousePositionToGameCoordinates(
        mousePosition,
        size,
      );
    if (isValidCoordinate(translatedCoordinates)) {
      return translatedCoordinates;
    }
    return null;
  };
}
