export class Coordinate {
  x: number;
  y: number;

  constructor(stringWithDelimiter: string) {
    const [x, y] = stringWithDelimiter.replace(' ', '').split(';');
    this.x = +x;
    this.y = +y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }

  equals(coordinate: Coordinate) {
    return this.toString() === coordinate.toString();
  }
}
