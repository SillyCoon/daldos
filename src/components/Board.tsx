import { GameState } from '../model/game-state';
import { MouseClickType, mouseToGame, GameEvent } from '../model/click-type';
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

      if (actionType === GameEvent.Pick && canPick(boardCoordinate)) {
        console.log('pick: ', boardCoordinate);
        onPickFigure(boardCoordinate);
      } else if (actionType === GameEvent.Move && canMove(boardCoordinate)) {
        console.log('move: ', boardCoordinate);
        onMoveFigure(boardCoordinate);
      } else if (
        actionType === GameEvent.Activate &&
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
    <div className={disabled ? 'pointer-events-none' : ''}>
      <Canvas
        size={size}
        colorScheme={colorScheme}
        onClick={handleBoardClick}
        gameState={gameState}
        statistic={statistic}
      ></Canvas>
    </div>
  );
};
