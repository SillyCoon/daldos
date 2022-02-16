import { useEffect, useState } from 'react';
import { Game } from './components/Game';
import { WelcomeScreen } from './components/WelcomeScreen';
import connectWs from './logic/communication/ws';
import { SimpleAI } from './logic/opponent/simple-ai';
import { GameMode } from './model/enums/game-mode';
import { PlayerDto } from './model/player';
import { PlayerService } from './service/player.service';

type GameSettings = { mode: GameMode } & { player: PlayerDto };

const App = () => {
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  const handleWelcomeScreenSubmit = (player: PlayerDto, mode: GameMode) => {
    setGameSettings({ mode, player });
  };

  useEffect(() => {
    if (gameSettings?.player) {
      PlayerService.registerPlayer(gameSettings.player);
    }
    if (gameSettings?.mode === GameMode.Multi) {
      connectWs();
    }
  });

  const needOpponent = gameSettings?.mode !== GameMode.Single;

  const renderGame = () =>
    gameSettings ? (
      <Game
        myName={gameSettings?.player?.name ?? 'Игрок 1'}
        mode={gameSettings?.mode ?? GameMode.Single}
        opponent={needOpponent ? new SimpleAI() : undefined}
      ></Game>
    ) : (
      <WelcomeScreen
        onWelcomeScreenSubmit={handleWelcomeScreenSubmit}
      ></WelcomeScreen>
    );

  return <div className="App">{renderGame()}</div>;
};

export default App;
