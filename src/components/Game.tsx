import { useEffect, useState } from 'react';
import './game.css';
import { GameMode } from '../model/enums/game-mode';
import { GameState } from '../model/game-state';
import { Opponent } from '../logic/opponent/opponent';
import { Command, isRoll, isActivate, isMove } from '../model/command';
import { Coordinate } from '../model/coordinate';
import { Size } from '../model/draw/size';
import { Statistic } from '../model/statistic';
import { Board } from './Board';
import { Controls } from './Controls';
import { Logger } from './Logger';
import { CommandExecutor } from '../logic/state-manipulator';
import { useLog } from '../hooks/useLog';

const size = new Size();

const timeout1000 = () =>
  new Promise<void>((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

export interface DaldozaProps {
  myName: string;
  mode: GameMode;
  opponent: Opponent | null;
}

const myColor = 1;

export const Game = (props: DaldozaProps) => {
  const [gameState, setGameState] = useState(GameState.start(size.fieldSize));
  const [events, log] = useLog();

  const executor = new CommandExecutor(gameState);

  const playerStatistics: Statistic = {
    name:
      gameState.currentPlayerColor === 1
        ? props.myName
        : props.opponent?.name ?? 'Игрок 2',
    win: false,
  };

  useEffect(() => {
    if (!gameState.hasAnyMove) {
      timeout1000().then(() => {
        setGameState(executor.skipMove());
      });
    }
  });

  const isMyMove = gameState.currentPlayerColor === myColor;

  const handleRoll = () => {
    log(gameState.currentPlayerColor, 'кинул кубики');
    setGameState(executor.roll());
  };

  const handlePickFigure = (coordinate: Coordinate) => {
    log(gameState.currentPlayerColor, `выбрал фигуру ${coordinate.toString()}`);
    setGameState(executor.pickFigure(coordinate));
  };

  const handleMoveFigure = (to: Coordinate, from?: Coordinate) => {
    const fromCoord = from ?? gameState.selectedFigure?.coordinate;

    if (fromCoord) {
      log(
        gameState.currentPlayerColor,
        `сходил ${fromCoord.toString()} -> ${to.toString()}`,
      );
      setGameState(executor.makeMove(fromCoord, to));
    }
  };

  const handleActivateFigure = (coordinate: Coordinate) => {
    log(
      gameState.currentPlayerColor,
      `активировал фигуру ${coordinate.toString()}`,
    );
    setGameState(executor.activate(coordinate));
  };

  useEffect(() => {
    if (props.mode !== GameMode.Single) {
      const handleOpponentCommand = (command: Command): void => {
        if (isRoll(command)) {
          handleRoll();
        }
        if (isActivate(command)) {
          handleActivateFigure(command.coordinate);
        }
        if (isMove(command)) {
          handleMoveFigure(command.to, command.from);
        }
      };

      if (!isMyMove) {
        props.opponent?.getCommandFor(gameState).then(handleOpponentCommand);
      }
    }
  }, [isMyMove, gameState]);

  const controlsDisabled =
    (!isMyMove && props.mode !== GameMode.Single) || !!gameState.dices.length;
  const boardDisabled = !isMyMove && props.mode !== GameMode.Single;

  return (
    <div className="flex flex-col ml-48">
      <div className="flex">
        <Board
          size={size}
          disabled={boardDisabled}
          statistic={playerStatistics}
          gameState={gameState}
          onPickFigure={handlePickFigure}
          onMoveFigure={handleMoveFigure}
          onActivateFigure={handleActivateFigure}
        ></Board>
        <Controls onRoll={handleRoll} disabled={controlsDisabled}></Controls>
      </div>
      <Logger events={events}></Logger>
    </div>
  );
};
