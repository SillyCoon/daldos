import { Coordinate } from '../../game/models/game-elements/coordinate';
import { BoardEventType } from './clickType';

export interface OpponentCommand {
  type: BoardEventType;
}

export class RollCommand implements OpponentCommand {
  type = BoardEventType.Roll;
}

export class PickCommand implements OpponentCommand {
  type = BoardEventType.Pick;
  constructor(public coordinate: Coordinate) {}
}

export class ActivateCommand implements OpponentCommand {
  type = BoardEventType.Activate;

  constructor(public coordinate: Coordinate) {}
}

export class MoveCommand implements OpponentCommand {
  type = BoardEventType.Move;
  constructor(
    public from: Coordinate,
    public to: Coordinate,
    public hasFigureToEat: boolean,
  ) {}
}

export const isActivate = (c: OpponentCommand): c is ActivateCommand =>
  c.type === BoardEventType.Activate;

export const isMove = (c: OpponentCommand): c is MoveCommand =>
  c.type === BoardEventType.Move;

export const isRoll = (c: OpponentCommand): c is RollCommand =>
  c.type === BoardEventType.Roll;
