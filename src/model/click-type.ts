export const enum MouseClickType {
  'Double',
  'Right',
  'Left',
  'Middle',
  'Undefined',
}
export const fromEventToType = (event: number) => {
  switch (event) {
    case 0:
      return MouseClickType.Left;
    case 1:
      return MouseClickType.Middle;
    case 2:
      return MouseClickType.Right;
    default:
      return MouseClickType.Undefined;
  }
};

export const enum GameEvent {
  'Pick',
  'Activate',
  'Move',
  'Roll',
  'Undefined',
}

export const mouseToGame = (mouseClick: MouseClickType) => {
  switch (mouseClick) {
    case MouseClickType.Left:
      return GameEvent.Pick;
    case MouseClickType.Right:
      return GameEvent.Move;
    case MouseClickType.Double:
      return GameEvent.Activate;
    default:
      return GameEvent.Undefined;
  }
};
