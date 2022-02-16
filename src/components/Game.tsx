import { useEffect, useState } from 'react';
import './game.css';
import { GameMode } from '../model/enums/game-mode';
import styled from 'styled-components';
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
import { LogEvent } from '../model/log-event';

const size = new Size();

const GameWrapper = styled.div`
  display: flex;
  margin-left: 200px;
`;

const timeout1000 = () =>
  new Promise<void>((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

export interface DaldozaProps {
  myName: string;
  mode: GameMode;
  opponent?: Opponent;
}

const myColor = 1;

export const Game = (props: DaldozaProps) => {
  const [gameState, setGameState] = useState(GameState.start(size.fieldSize));
  const [events, setEvents] = useState<LogEvent[]>([]);

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

  const prependEvent = (event: LogEvent): void => {
    setEvents([event, ...events]);
  };

  const isMyMove = gameState.currentPlayerColor === myColor;

  const handleRoll = () => {
    prependEvent({
      player: gameState.currentPlayerColor,
      message: 'кинул кубики',
    });
    setGameState(executor.roll());
  };

  const handlePickFigure = (coordinate: Coordinate) => {
    prependEvent({
      player: gameState.currentPlayerColor,
      message: `выбрал фигуру ${coordinate.toString()}`,
    });
    setGameState(executor.pickFigure(coordinate));
  };

  const handleMoveFigure = (to: Coordinate, from?: Coordinate) => {
    const fromCoord = from ?? gameState.selectedFigure?.coordinate;

    if (fromCoord) {
      prependEvent({
        player: gameState.currentPlayerColor,
        message: `сходил ${fromCoord.toString()} -> ${to.toString()}`,
      });
      setGameState(executor.makeMove(fromCoord, to));
    }
  };

  const handleActivateFigure = (coordinate: Coordinate) => {
    prependEvent({
      player: gameState.currentPlayerColor,
      message: `активировал фигуру ${coordinate.toString()}`,
    });
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
    <GameWrapper>
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
      <Logger events={events}></Logger>
    </GameWrapper>
  );
};
