import styled, { css } from 'styled-components';
import { GameState } from '../model/game-state';
import {
  MouseClickType,
  mouseToGame,
  BoardEventType,
} from '../model/click-type';
import { Coordinate } from '../model/coordinate';
import { ColorScheme } from '../model/draw/color-scheme';
import { Size } from '../model/draw/size';
import { Statistic } from '../model/statistic';
import { Canvas } from './Canvas';

interface BoardProps {
  size: Size;
  disabled: boolean;
  gameState: GameState;
  statistic: Statistic;
  onPickFigure: (figureCoordinate: Coordinate) => void;
  onMoveFigure: (to: Coordinate) => void;
  onActivateFigure: (figureCoordinate: Coordinate) => void;
}

const BoardWrapper = styled.div`
  ${(props: { disabled?: boolean }) =>
    props.disabled &&
    css`
      disabled: true;
    `}
`;

const colorScheme = new ColorScheme();

export const Board = ({
  size,
  disabled,
  gameState,
  statistic,
  onPickFigure,
  onMoveFigure,
  onActivateFigure,
}: BoardProps) => {
  const handleBoardClick = (
    boardCoordinate: Coordinate,
    clickType: MouseClickType,
  ) => {
    if (!disabled) {
      const actionType = mouseToGame(clickType);

      if (actionType === BoardEventType.Pick && canPick(boardCoordinate)) {
        console.log('pick: ', boardCoordinate);
        onPickFigure(boardCoordinate);
      } else if (
        actionType === BoardEventType.Move &&
        canMove(boardCoordinate)
      ) {
        console.log('move: ', boardCoordinate);
        onMoveFigure(boardCoordinate);
      } else if (
        actionType === BoardEventType.Activate &&
        canActivate(boardCoordinate)
      ) {
        onActivateFigure(boardCoordinate);
        console.log('activate: ', boardCoordinate);
      } else {
        console.log('no moves for this coordinate: ', boardCoordinate);
      }
    }
  };

  const canPick = (coordinate: Coordinate) => {
    return gameState.canPick(coordinate);
  };

  const canMove = (coordinate: Coordinate) => {
    return gameState.isSquareAvailableToMove(coordinate);
  };

  const canActivate = (coordinate: Coordinate) => {
    return gameState.canActivate(coordinate);
  };

  return (
    <BoardWrapper disabled={disabled}>
      <Canvas
        size={size}
        colorScheme={colorScheme}
        onClick={handleBoardClick}
        gameState={gameState}
        statistic={statistic}
      ></Canvas>
    </BoardWrapper>
  );
};

class InteractiveBoardTemplate {
  // handleDoubleClick() {
  //   return fromEvent<MouseEvent>(this.canvas, 'dblclick').pipe(
  //     map((event) => this.getActionCoordinate(event)),
  //     filter((coordinates) => !!coordinates),
  //   );
  // }
  // handleLeftClick() {
  //   return this._handleMouseupEvent().pipe(
  //     filter((event) => event.button === 0),
  //     map((event) => this.getActionCoordinate(event)),
  //   );
  // }
  // handleRightClick() {
  //   return this._handleMouseupEvent().pipe(
  //     filter((event) => event.button === 2),
  //     map((event) => this.getActionCoordinate(event)),
  //   );
  // }
  // _handleMouseupEvent(): Observable<MouseEvent> {
  //   return fromEvent<MouseEvent>(this.canvas, 'mouseup').pipe(
  //     filter((event) => !!this.getActionCoordinate(event)),
  //   );
  // }
}
function fromMouseToGame(clickType: MouseClickType) {
  throw new Error('Function not implemented.');
}
