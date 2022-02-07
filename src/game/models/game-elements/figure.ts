import { Color } from './color';

export class Figure {
  color: Color;
  isActive: Boolean;
  canMove: Boolean;

  constructor(color: Color) {
    this.color = color;
    this.isActive = false;
    this.canMove = false;
  }

  activate() {
    this.isActive = true;
  }

  get active() {
    return this.isActive;
  }

  get isFirstPlayer() {
    return this.color === 1;
  }

  canActivatedBy(player: Color) {
    return !this.active && this.color === player;
  }
}
