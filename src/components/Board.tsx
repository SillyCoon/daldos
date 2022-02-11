import { Size } from '../game/models/draw/size';
import styled, { css } from 'styled-components';
import { Canvas } from './Canvas';
import { ColorScheme } from '../game/models/draw/color-scheme';
import { GameState } from '../game/logic/game-state';
import { Statistic } from '../game/models/game-elements/statistic';

interface BoardProps {
  size: Size;
  disabled: boolean;
  gameState: GameState;
  statistic: Statistic;
}

const handleBoardClick = () => void 0;

const BoardWrapper = styled.div`
  ${(props: { disabled?: boolean }) =>
    props.disabled &&
    css`
      disabled: true;
    `}
`;

export const Board = ({ size, disabled, gameState, statistic }: BoardProps) => {
  const colorScheme = new ColorScheme();
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
