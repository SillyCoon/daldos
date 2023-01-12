import { Ref, useEffect, useRef, useState } from 'react';
import { CanvasCoordinateTranslator } from '../helpers/canvas-coordinate-translator';
import { GameState } from '../model/game-state';
import { ReactDrawer } from '../logic/react-drawer';
import { CanvasClickEvent } from '../model/draw/canvas-click-event';
import { MouseClickType, fromEventToType } from '../model/click-type';
import { Coordinate } from '../model/coordinate';
import { ColorScheme } from '../model/draw/color-scheme';
import { Size } from '../model/draw/size';
import { Statistic } from '../model/statistic';

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
  }, [colorScheme, size]);

  useEffect(() => {
    if (drawer) {
      drawer.draw(gameState, statistic);
    }
  }, [drawer, gameState, statistic]);

  const handleCanvasClick = (e: CanvasClickEvent) => {
    if (rect) {
      const clickCoord =
        CanvasCoordinateTranslator.canvasClickToBoardCoordinate(e, size, rect);
      if (clickCoord) {
        onClick(clickCoord, fromEventToType(e.button));
      } else {
        console.log('click outside the field');
      }
    }
  };

  const handleCanvasDoubleClick = (e: CanvasClickEvent) => {
    if (rect) {
      const clickCoord =
        CanvasCoordinateTranslator.canvasClickToBoardCoordinate(e, size, rect);
      if (clickCoord) {
        onClick(clickCoord, MouseClickType.Double);
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
      onClick={(e) => (e.button === 3 ? e.preventDefault() : null)}
      onMouseUp={(e) => handleCanvasClick(e)}
      onDoubleClick={(e) => handleCanvasDoubleClick(e)}
    ></canvas>
  );
};
