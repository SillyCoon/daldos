import { Ref, useEffect, useRef, useState } from 'react';
import { GameState } from '../game/logic/game-state';
import { ColorScheme } from '../game/models/draw/color-scheme';
import { Size } from '../game/models/draw/size';
import { Coordinate } from '../game/models/game-elements/coordinate';
import { Statistic } from '../game/models/game-elements/statistic';
import { CanvasCoordinateTranslator } from './helpers/canvasCoordinateTranslator';
import { ReactDrawer } from './helpers/react-drawer';
import { CanvasClickEvent } from './model/canvasClickEvent';
import { fromEventToType, MouseClickType } from './model/clickType';

export interface CanvasProps {
  size: Size;
  colorScheme: ColorScheme;
  gameState: GameState;
  statistic: Statistic;
  onClick: (boardCoordinate: Coordinate, clickType: MouseClickType) => void;
}

export const Canvas = ({
  size,
  colorScheme,
  onClick,
  gameState,
  statistic,
}: CanvasProps) => {
  const canvasRef: Ref<HTMLCanvasElement> | undefined = useRef(null);
  const [rect, setRect] = useState<DOMRect>();
  const [drawer, setDrawer] = useState<ReactDrawer>();

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    setRect(canvasRef.current?.getBoundingClientRect());
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const drawer = new ReactDrawer(context, colorScheme, size);
      setDrawer(drawer);
    } else {
      console.log('no canvas \\0_0/');
    }
  }, [canvasRef, colorScheme, size]);

  if (drawer) {
    drawer.draw(gameState, statistic);
  }

  const handleCanvasClick = (e: CanvasClickEvent) => {
    if (rect) {
      const clickCoord =
        CanvasCoordinateTranslator.canvasClickToBoardCoordinate(
          e,
          size.fieldSize,
          rect,
        );
      if (clickCoord) {
        onClick(clickCoord, fromEventToType(e.button));
      } else {
        console.log('click outside the field');
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseUp={(e) => handleCanvasClick(e)}
    ></canvas>
  );
};
