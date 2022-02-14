export class Size {
  height: number;
  width: number;
  fieldSize: number;

  constructor(height = 800, width = 600, fieldSize = 16) {
    this.height = height;
    this.width = width;
    this.fieldSize = fieldSize;
  }

  get square() {
    return Math.floor(Math.min(this.height / 20, this.width / 6));
  }

  get fontSize() {
    return Math.floor(this.square / 2);
  }

  get numerationPadding() {
    return this.fontSize * 2;
  }
}
