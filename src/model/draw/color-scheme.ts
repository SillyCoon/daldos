export class ColorScheme {
  firstPlayerColor: string;
  secondPlayerColor: string;
  fieldColor: string;
  basicSquare: string;
  highlightedSquare: string;

  constructor(
    firstPlayerColor = 'red',
    secondPlayerColor = 'green',
    fieldColor = 'black',
  ) {
    this.firstPlayerColor = firstPlayerColor;
    this.secondPlayerColor = secondPlayerColor;
    this.fieldColor = fieldColor;
    this.basicSquare = 'black';
    this.highlightedSquare = 'purple';
  }
}
