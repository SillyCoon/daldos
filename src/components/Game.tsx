import { useState } from 'react';
import './game.css';
import { GameModeEnum } from '../game/models/game-elements/enums/game-mode';
import { Opponent } from '../game/logic/opponent/opponent';
import { Size } from '../game/models/draw/size';
import { Board } from './Board';
import { Controls } from './Controls';
import { Logger } from './Logger';
import { GameState } from '../game/logic/game-state';
import styled from 'styled-components';
import { CommandTypeEnum } from '../game/models/game-elements/enums/command-type';
import { Coordinate } from '../game/models/game-elements/coordinate';
import { Statistic } from '../game/models/game-elements/statistic';

const size = new Size();

const GameWrapper = styled.div`
  display: flex;
`;

export interface DaldozaProps {
  myName: string;
  mode: GameModeEnum;
  opponent: Opponent;
}

export const Game = (props: DaldozaProps) => {
  const [gameState, setGameState] = useState(GameState.start(size.fieldSize));
  const [events, setEvents] = useState<any[]>([]);

  const playerStatistics: Statistic = {
    name:
      gameState.currentPlayerColor === 1 ? props.myName : props.opponent.name,
    win: false,
  };

  const handleRoll = () => {
    setGameState(gameState.command(CommandTypeEnum.Roll));
  };

  const handlePickFigure = (coordinate: Coordinate) => {
    setGameState(gameState.pickFigure(coordinate));
  };

  const handleMoveFigure = (to: Coordinate) => {
    const from = gameState.selectedFigure?.coordinate;
    if (from) setGameState(gameState.makeMove(from, to));
  };

  const handleActivateFigure = (coordinate: Coordinate) => {
    setGameState(gameState.activate(coordinate));
  };

  return (
    <GameWrapper>
      <Board
        size={size}
        disabled={gameState.hasAnyAvailableMove()}
        statistic={playerStatistics}
        gameState={gameState}
        onPickFigure={handlePickFigure}
        onMoveFigure={handleMoveFigure}
        onActivateFigure={handleActivateFigure}
      ></Board>
      <Controls onRoll={() => handleRoll()}></Controls>
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
