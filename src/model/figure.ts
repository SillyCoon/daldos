import { Color } from './color';

export class Figure {
  color: Color;
  isActive: boolean;
  canMove: boolean;

  constructor(color: Color, isActive?: boolean) {
    this.color = color;
    this.isActive = isActive ?? false;
    this.canMove = false;
  }

  activate() {
    this.isActive = true;
  }

  withActivated(activated: boolean): Figure {
    return new Figure(this.color, activated);
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
