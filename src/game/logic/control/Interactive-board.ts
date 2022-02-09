import { Container } from './container';
import { BaseControl } from './base-control';
import { CoordinateTranslator } from '../coordinate-translator';
import { fromEvent, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Coordinate } from '../../models/game-elements/coordinate';

export class InteractiveBoard implements BaseControl {
  nativeElement: HTMLElement;
  canvas: HTMLCanvasElement;
  fieldSize: number;

  constructor(size: { width: number; height: number; fieldSize: number }) {
    const boardContainer = new Container('', 'dal-field');
    const canvas = document.createElement('canvas');
    canvas.id = 'dal-canvas';
    canvas.width = size.width;
    canvas.height = size.height;
    boardContainer.appendElement(canvas);

    this.nativeElement = boardContainer.nativeElement;

    this.fieldSize = size.fieldSize;
    this.canvas = canvas;
    this._disableContextMenu();
  }

  _disableContextMenu() {
    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }

  disable() {
    this.nativeElement.classList.add('disabled-field');
  }

  enable() {
    this.nativeElement.classList.remove('disabled-field');
  }

  handleDoubleClick() {
    return fromEvent<MouseEvent>(this.canvas, 'dblclick').pipe(
      map((event) => this.getActionCoordinate(event)),
      filter((coordinates) => !!coordinates),
    );
  }

  handleLeftClick() {
    return this._handleMouseupEvent().pipe(
      filter((event) => event.button === 0),
      map((event) => this.getActionCoordinate(event)),
    );
  }

  handleRightClick() {
    return this._handleMouseupEvent().pipe(
      filter((event) => event.button === 2),
      map((event) => this.getActionCoordinate(event)),
    );
  }

  _handleMouseupEvent(): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(this.canvas, 'mouseup').pipe(
      filter((event) => !!this.getActionCoordinate(event)),
    );
  }

  getActionCoordinate(event: MouseEvent) {
    const mousePosition = this.getMousePosition(event);
    const translatedCoordinates =
      CoordinateTranslator.translateMousePositionToGameCoordinates(
        mousePosition,
      );
    if (this.isValidCoordinate(translatedCoordinates)) {
      return translatedCoordinates;
    }
    return null;
  }

  getMousePosition(event: MouseEvent): Coordinate {
    const canvasSize = this.canvas.getBoundingClientRect();
    return Coordinate.fromXY(
      event.clientX - canvasSize.left,
      event.clientY - canvasSize.top,
    );
  }

  isValidCoordinate({ x, y }: { x: number; y: number }) {
    const isValid =
      x >= 0 &&
      x < 3 &&
      y >= 0 &&
      (y < this.fieldSize || (x === 1 && y < this.fieldSize + 1));
    if (!isValid) console.log('click outside the field');
    return isValid;
  }
}
