import { BoardEventType } from './click-type';
import { Coordinate } from './coordinate';

export interface Command {
  type: BoardEventType;
}

export class RollCommand implements Command {
  type = BoardEventType.Roll;
}

export class PickCommand implements Command {
  type = BoardEventType.Pick;
  constructor(public coordinate: Coordinate) {}
}

export class ActivateCommand implements Command {
  type = BoardEventType.Activate;

  constructor(public coordinate: Coordinate) {}
}

export class MoveCommand implements Command {
  type = BoardEventType.Move;
  constructor(
    public from: Coordinate,
    public to: Coordinate,
    public hasFigureToEat: boolean,
  ) {}
}

export const isActivate = (c: Command): c is ActivateCommand =>
  c.type === BoardEventType.Activate;

export const isMove = (c: Command): c is MoveCommand =>
  c.type === BoardEventType.Move;

export const isRoll = (c: Command): c is RollCommand =>
  c.type === BoardEventType.Roll;
