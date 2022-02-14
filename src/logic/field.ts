import { Color } from '../model/color';
import { Coordinate } from '../model/coordinate';
import { FieldException } from '../model/exceptions/field-exception';
import { FieldSnapshot } from '../model/field-snapshot';
import { Figure } from '../model/figure';
import { Square } from '../model/square';
import { NotationConverter } from './notation-converter';

// fully immutable field!!!
export class Field {
  squares: Square[][] = [];
  flatSquares: Square[] = [];

  get middleRowLength() {
    return this.sideRowLength + 1;
  }

  get sideRowLength(): number {
    return this.squares[0].length;
  }

  get colsLength(): number {
    return this.squares.length;
  }

  get squaresWithFigures(): Square[] {
    return this.flatSquares.filter((s) => !!s.figure);
  }

  constructor(squares: Square[][]) {
    this.squares = squares;
    this.flatSquares = squares.flat();
  }

  static initial(size = 16): Field {
    const snapshot = new FieldSnapshot(NotationConverter.initialNotation(size));
    return Field.restore(snapshot);
  }

  static restore(snapshot: FieldSnapshot): Field {
    const fieldColumns: string[][] = snapshot.value
      .split('\n')
      .map((c) => c.split(''));

    const makeFigure = (char: string) => NotationConverter.charToFigure(char);

    const squares = fieldColumns.map((col, x) =>
      col.map(
        (square, y) => new Square(Coordinate.fromXY(x, y), makeFigure(square)),
      ),
    );

    return new Field(squares);
  }

  makeSnapshot(): FieldSnapshot {
    const snapshot = new FieldSnapshot(NotationConverter.toNotation(this));
    return snapshot;
  }

  *iterate(direction = 1) {
    const from: Coordinate =
      direction === 1 ? Coordinate.fromXY(0, 0) : Coordinate.fromXY(2, 0);
    const to: Coordinate =
      direction === 1 ? Coordinate.fromXY(2, 0) : Coordinate.fromXY(0, 0);

    yield* this.iterateFromTo(direction, from, to);
  }

  *iterateFromTo(
    direction: number,
    from: Coordinate,
    to: Coordinate,
    condition: (x: Coordinate) => Boolean = () => true,
  ) {
    let x = from.x;
    let y = from.y;

    do {
      if (condition(Coordinate.fromXY(x, y))) {
        yield this.squares[x][y];
      }

      if (x === 0 || x === 2) {
        if (y === 0) {
          x = 1;
          y = 0;
        } else {
          y--;
        }
      } else {
        if (y === this.middleRowLength - 1) {
          x = direction === 1 ? 2 : 0;
          y = this.sideRowLength - 1;
        } else {
          y++;
        }
      }
    } while (x !== to.x || y !== to.y);
    yield this.squares[to.x][to.y]; // last square
  }

  *iterateFromToExcludeFirst(
    direction: number,
    from: Coordinate,
    to: Coordinate,
  ) {
    yield* this.iterateFromTo(
      direction,
      from,
      to,
      ({ x, y }) => x !== from.x || y !== from.y,
    );
  }

  equals(otherField: Field) {
    return this.makeSnapshot() === otherField.makeSnapshot();
  }

  activate(figureCoordinate: Coordinate, currentColor: Color): Field {
    const figure = this.pickFigure(figureCoordinate)?.figure;

    if (figure?.canActivatedBy(currentColor)) {
      return this.replaceFigure(figureCoordinate, figure.withActivated(true));
    }
    return this;
  }

  moveFigure(from: Coordinate, to: Coordinate): Field {
    const fromSquare = this.findSquare(from);
    const toSquare = this.findSquare(to);

    if (!fromSquare || !toSquare) throw new FieldException('Неправильный ход!');

    const fromFigure = this.pickFigure(from)?.figure ?? null;

    return this.replaceFigure(from, null).replaceFigure(to, fromFigure);
  }

  pickFigure(coordinate: Coordinate): Square | null {
    const square = this.squares?.at(coordinate.x)?.at(coordinate.y);
    if (square?.figure) {
      return square;
    } else {
      return null;
    }
  }

  findSquare(coordinate: Coordinate): Square {
    return this.squares[coordinate.x][coordinate.y];
  }

  getAnyFigureOfColorCanMoveOn(distance: number, color: Color): Square | null {
    return this.getAllFiguresOfColorCanMoveOn(distance, color).at(-1) ?? null;
  }

  getAllFiguresOfColorCanMoveOn(distance: number, color: Color): Square[] {
    return this.squaresWithFigures.filter((square) => {
      let squareToMove;
      if (square.figure?.color === color && square.figure?.active) {
        squareToMove = this.getNotBlockedSquareCoordinateByDistanceFrom(
          square.coordinate,
          distance,
          color,
        );
      }
      return !!squareToMove;
    });
  }

  getNotBlockedSquareCoordinateByDistanceFrom(
    fromCoordinate: Coordinate,
    distance: number,
    blockingColor: Color,
  ): Coordinate | null {
    const squareOnDistance = this.getSquareByDistanceFromCurrent(
      fromCoordinate,
      distance,
      blockingColor,
    );

    if (!squareOnDistance) {
      throw new FieldException('no such square!');
    }

    if (
      this.hasFiguresOnWay({
        from: fromCoordinate,
        to: squareOnDistance.coordinate,
        direction: blockingColor,
      })
    ) {
      return null;
    }
    return squareOnDistance.coordinate;
  }

  distance(from: Coordinate, to: Coordinate): number {
    const fromSideToCenter = () => from.y + to.y + 1;
    const fromCenterToSide = () =>
      this.middleRowLength - from.y + (this.sideRowLength - to.y) - 1;
    const onOneLine = () => Math.abs(to.y - from.y);

    if (to.x === from.x) {
      return onOneLine();
    } else if (from.x === 1) {
      return fromCenterToSide();
    } else {
      return fromSideToCenter();
    }
  }

  getSquareByDistanceFromCurrent(
    currentSquareCoordinates: Coordinate,
    distance: number,
    direction: number,
  ): Square | undefined {
    for (const nextSquare of this.iterateFromToExcludeFirst(
      direction,
      currentSquareCoordinates,
      currentSquareCoordinates,
    )) {
      if (
        this.distance(currentSquareCoordinates, nextSquare.coordinate) ===
        distance
      )
        return nextSquare;
    }
  }

  onlyOneFigureOfColor(color: Color): boolean {
    const figuresCounter = this.squaresWithFigures.filter(
      (square) => square.figure?.color === color,
    ).length;
    return figuresCounter <= 1;
  }

  hasFiguresOnWay({
    from,
    to,
    direction,
  }: {
    from: Coordinate;
    to: Coordinate;
    direction: number;
  }) {
    for (const square of this.iterateFromToExcludeFirst(direction, from, to)) {
      if (square.figure?.color === direction) return true;
    }
    return false;
  }

  getAllFiguresCanActivate(color: Color): Square[] {
    return this.squaresWithFigures.filter(
      (square) => square.figure?.color === color && !square.figure?.active,
    );
  }

  anyActiveFigure(color: Color): boolean {
    return this.anyFigureSuitsCondition(
      color,
      (clr, figure) => !!figure && figure.active && figure.color === clr,
    );
  }

  anyNotActiveFigure(color: Color): boolean {
    return this.anyFigureSuitsCondition(
      color,
      (clr, figure) => !!figure && !figure.active && figure.color === clr,
    );
  }

  private anyFigureSuitsCondition(
    color: Color,
    condition: (x: Color, y: Figure | null) => boolean,
  ) {
    for (const square of this.iterate()) {
      if (condition(color, square.figure)) return true;
    }
    return false;
  }

  replaceFigure(coord: Coordinate, figure: Figure | null): Field {
    const replaceInCol = (col: Square[]) =>
      col.map((square, y) =>
        y === coord.y ? square.withFigure(figure) : square,
      );

    return new Field(
      this.squares.map((col, x) => (x === coord.x ? replaceInCol(col) : col)),
    );
  }
}
