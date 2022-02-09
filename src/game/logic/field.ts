import { Square } from '../models/game-elements/square';
import { NotationConverter } from './notation-converter';
import { FieldException } from '../models/game-elements/exceptions/field-exception';
import { FieldSnapshot } from '../models/game-elements/field-snapshot';
import { Coordinate } from '../models/game-elements/coordinate';
import { Color } from '../models/game-elements/color';
import { Figure } from '../models/game-elements/figure';

export type FieldFigure = Figure & { coordinate: Coordinate };

export class Field {
  squares: Square[][] = [];
  sideRowLength: number;
  colsLength: number = 3;
  figures: FieldFigure[] = [];

  get middleRowLength() {
    return this.sideRowLength + 1;
  }

  constructor(snapshot: FieldSnapshot) {
    this.sideRowLength = snapshot.size;
    this.colsLength = 3;
    this.restore(snapshot.value);
  }

  static initial(size = 16): Field {
    const snapshot = new FieldSnapshot(NotationConverter.initialNotation(size));
    return new Field(snapshot);
  }

  activate(figureCoordinate: Coordinate, currentColor: Color): Field {
    const changingField = this.clone();
    const activatingFigure = changingField.pickFigure(figureCoordinate);

    if (activatingFigure && activatingFigure.canActivatedBy(currentColor)) {
      activatingFigure.activate();
      return changingField;
    }
    return this;
  }

  moveFigure(from: Coordinate, to: Coordinate): Field {
    const changingField = this.clone(); // чтобы изменения не затронули старое состояние поля
    const fromSquare = changingField.findSquare(from);
    const toSquare = changingField.findSquare(to);

    if (!fromSquare || !toSquare) throw new FieldException('Неправильный ход!');

    toSquare.figure = fromSquare.figure;
    fromSquare.figure = null;

    // TODO: архитектура от бога просто, чтобы поменять координаты фигур, придется еще раз
    // переводить в нотацию и создавать поле
    // в перспективе можно двигать сразу в нотации или избавиться от понятия поля и оставить только фигуры
    // или избавиться от поля в данном виде и оставить только нотацию в виде массива символов

    // snapshot[to.x][to.y] = snapshot[from.x][from.y]
    // snapshot[from.x][from.y] = '*'
    return changingField.clone();
  }

  pickFigure(coordinate: Coordinate): FieldFigure | null {
    // TODO: лучше массивом с прямым доступом по координатам
    // тогда и в фигуры пихать не придется эту залупу сука тупой идиот писавший это (я)
    const figure = this.figures.find(
      (figure) =>
        figure.coordinate?.x === coordinate.x &&
        figure.coordinate?.y === coordinate.y,
    );
    return figure ?? null;
  }

  findSquare(coordinate: Coordinate): Square {
    return this.squares[coordinate.x][coordinate.y];
  }

  getAnyFigureOfColorCanMoveOn(
    distance: number,
    color: Color,
  ): FieldFigure | null {
    return this.getAllFiguresOfColorCanMoveOn(distance, color).pop() ?? null;
  }

  getAllFiguresOfColorCanMoveOn(distance: number, color: Color): FieldFigure[] {
    return this.figures.filter((figure) => {
      let squareToMove;
      if (figure.color === color && figure.active && figure.coordinate) {
        squareToMove = this.getNotBlockedSquareCoordinateByDistanceFrom(
          figure.coordinate,
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

  distance(from: Coordinate, to: Coordinate) {
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
    const figuresCounter = this.figures.filter(
      (figure) => figure.color === color,
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

  getAllFiguresCanActivate(color: Color): FieldFigure[] {
    return this.figures.filter(
      (figure) => figure.color === color && !figure.active,
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

  makeSnapshot(): FieldSnapshot {
    const snapshot = new FieldSnapshot(NotationConverter.toNotation(this));
    return snapshot;
  }

  // dirty hack
  private addCoordinate(figure: Figure, coordinate: Coordinate): FieldFigure {
    return Object.setPrototypeOf(
      { ...figure, coordinate },
      Object.getPrototypeOf(figure),
    );
  }

  restore(snapshot: string): void {
    this.squares = [];
    this.figures = [];
    const fieldColumns = snapshot.split('\n');

    const makeFigure = (
      char: string,
      coordinate: Coordinate,
    ): FieldFigure | null => {
      const figure: Figure | null = NotationConverter.charToFigure(char);
      return figure ? this.addCoordinate(figure, coordinate) : null;
    };

    for (let x = 0; x < this.colsLength; x++) {
      this.squares.push([]);
      const rowLength = x === 1 ? this.middleRowLength : this.sideRowLength;
      for (let y = 0; y < rowLength; y++) {
        const figure = makeFigure(fieldColumns[x][y], Coordinate.fromXY(x, y));
        if (figure) this.figures.push(figure);
        this.squares[x].push(new Square(Coordinate.fromXY(x, y), figure));
      }
    }
  }

  equals(otherField: Field) {
    return this.makeSnapshot() === otherField.makeSnapshot();
  }

  clone() {
    return new Field(this.makeSnapshot());
  }
}
