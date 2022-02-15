import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Game } from './components/Game';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SimpleAI } from './logic/simple-ai';
import { GameMode } from './model/enums/game-mode';
import { io } from 'socket.io-client';
import { Player } from './model/player';

const Navbar = styled.div`
  width: 100%;
  height: 50px;
  background-color: red;
  margin-bottom: 10px;
`;

const ws = io('http://localhost:3000');

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  const handleWelcomeScreenSubmit = (player: Player, mode: GameMode) => {
    setGameMode(mode);
    setPlayer(player);
  };

  useEffect(() => {
    fetch('http://localhost:3000/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(player),
    }).then((r) => r.json().then((t) => console.log(t)));
  });

  const needOpponent = gameMode !== GameMode.Single;

  // useEffect(() => {
  //   ws.on('connect', () => {
  //     console.log('connected');
  //     ws.send(JSON.stringify({ type: 'events', msg: 'string' }));
  //   });
  // });

  const renderGame = () =>
    gameMode ? (
      <Game
        myName={'player'}
        mode={gameMode}
        opponent={needOpponent ? new SimpleAI() : undefined}
      ></Game>
    ) : (
      <WelcomeScreen
        onWelcomeScreenSubmit={handleWelcomeScreenSubmit}
      ></WelcomeScreen>
    );

  return <div className="App">{renderGame()}</div>;
}

export default App;
