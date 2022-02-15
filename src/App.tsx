import { useState } from 'react';
import styled from 'styled-components';
import { Game } from './components/Game';
import { GameTypeSelector } from './components/GameTypeSelector';
import { SimpleAI } from './logic/simple-ai';
import { GameMode } from './model/enums/game-mode';

const Navbar = styled.div`
  width: 100%;
  height: 50px;
  background-color: red;
  margin-bottom: 10px;
`;

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const handleAIClick = () => {
    setGameMode(GameMode.AI);
  };

  const handleSingleClick = () => {
    setGameMode(GameMode.Single);
  };

  const needOpponent = gameMode !== GameMode.Single;

  const renderGame = () =>
    gameMode ? (
      <Game
        myName={'player'}
        mode={gameMode}
        opponent={needOpponent ? new SimpleAI() : undefined}
      ></Game>
    ) : (
      <GameTypeSelector
        onAIClick={handleAIClick}
        onSingleClick={handleSingleClick}
      ></GameTypeSelector>
    );

  return <div className="App">{renderGame()}</div>;
}

export default App;
