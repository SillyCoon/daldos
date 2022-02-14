import { Color } from './color';

export class Player {
  color: Color;
  name: string;
  figuresCounter: number;

  constructor(color: Color, name: string, figuresCounter = 16) {
    this.color = color;
    this.name = name;
    this.figuresCounter = figuresCounter;
  }

  getColor() {
    return this.color === 1 ? 'red' : 'green';
  }
}
