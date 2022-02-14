import { useEffect, useState } from 'react';
import './game.css';
import { GameModeEnum } from '../model/enums/game-mode';
import styled from 'styled-components';
import { GameState } from '../model/game-state';
import { ReactOpponent } from '../logic/opponent';
import { OpponentCommand, isRoll, isActivate, isMove } from '../model/command';
import { Coordinate } from '../model/coordinate';
import { Size } from '../model/draw/size';
import { CommandTypeEnum } from '../model/enums/command-type';
import { Statistic } from '../model/statistic';
import { Board } from './Board';
import { Controls } from './Controls';
import { Logger } from './Logger';
import { StateManipulator } from '../logic/state-manipulator';

const size = new Size();

const GameWrapper = styled.div`
  display: flex;
`;

export interface DaldozaProps {
  myName: string;
  mode: GameModeEnum;
  opponent: ReactOpponent;
}

const myColor = 1;

export const Game = (props: DaldozaProps) => {
  const [gameState, setGameState] = useState(GameState.start(size.fieldSize));
  const [events, setEvents] = useState<any[]>([]);

  const stateManipulator = new StateManipulator(gameState);

  const playerStatistics: Statistic = {
    name:
      gameState.currentPlayerColor === 1 ? props.myName : props.opponent.name,
    win: false,
  };

  if (!gameState.hasAnyMove) {
    setGameState(stateManipulator.skipMove());
  }

  const isMyMove = gameState.currentPlayerColor === myColor;

  useEffect(() => {
    if (!isMyMove) {
      props.opponent.getCommandFor(gameState).then((c: OpponentCommand) => {
        if (isRoll(c)) {
          handleRoll();
        }
        if (isActivate(c)) {
          handleActivateFigure(c.coordinate);
        }
        if (isMove(c)) {
          handleMoveFigure(c.to, c.from);
        }
      });
    }
  });

  const handleRoll = () => {
    setGameState(stateManipulator.roll());
  };

  const handlePickFigure = (coordinate: Coordinate) => {
    setGameState(stateManipulator.pickFigure(coordinate));
  };

  const handleMoveFigure = (to: Coordinate, from?: Coordinate) => {
    const fromCoord = from ?? gameState.selectedFigure?.coordinate;
    if (fromCoord) setGameState(stateManipulator.makeMove(fromCoord, to));
  };

  const handleActivateFigure = (coordinate: Coordinate) => {
    setGameState(stateManipulator.activate(coordinate));
  };

  return (
    <GameWrapper>
      <Board
        size={size}
        disabled={!isMyMove}
        statistic={playerStatistics}
        gameState={gameState}
        onPickFigure={handlePickFigure}
        onMoveFigure={handleMoveFigure}
        onActivateFigure={handleActivateFigure}
      ></Board>
      <Controls onRoll={() => handleRoll()} disabled={!isMyMove}></Controls>
      <Logger events={events}></Logger>
    </GameWrapper>
  );
};

// export const RawGame = () => {

//   // useEffect(() => {
//   //   const container = new Container('game-container');
//   //   document.body.appendChild(container.nativeElement);
//   //   const app = new Daldoza(container, 'player', { mode: 0 }, new PrimitiveAI());
//   //   app.start();
//   // });

//   return <></>;
// };

// export const Game = styled(RawGame)`
// `;
