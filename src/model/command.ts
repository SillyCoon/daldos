import { GameEvent } from './click-type';
import { Coordinate } from './coordinate';

export interface Command {
  type: GameEvent;
}

export class RollCommand implements Command {
  type = GameEvent.Roll;
}

export class PickCommand implements Command {
  type = GameEvent.Pick;
  constructor(public coordinate: Coordinate) {}
}

export class ActivateCommand implements Command {
  type = GameEvent.Activate;

  constructor(public coordinate: Coordinate) {}
}

export class MoveCommand implements Command {
  type = GameEvent.Move;
  constructor(
    public from: Coordinate,
    public to: Coordinate,
    public hasFigureToEat: boolean,
  ) {}
}

export const isActivate = (c: Command): c is ActivateCommand =>
  c.type === GameEvent.Activate;

export const isMove = (c: Command): c is MoveCommand =>
  c.type === GameEvent.Move;

export const isRoll = (c: Command): c is RollCommand =>
  c.type === GameEvent.Roll;
