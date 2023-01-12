import { useEffect, useState } from 'react';
import { Game } from './components/Game';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MultiplayerOpponent } from './logic/opponent/multiplayer';
import { Opponent } from './logic/opponent/opponent';
import { SimpleAI } from './logic/opponent/simple-ai';
import { GameMode } from './model/enums/game-mode';
import { Player, PlayerDto } from './model/player';
import { OpponentService } from './service/opponent.service';
import { PlayerService } from './service/player.service';

type GameSettings = { mode: GameMode } & { player: PlayerDto };

const Daldoza = () => {
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handleWelcomeScreenSubmit = (player: PlayerDto, mode: GameMode) => {
    setGameSettings({ mode, player });
  };

  // useEffect(() => {
  //   if (gameSettings?.player)
  //     PlayerService.registerPlayer(gameSettings.player).then((player) => {
  //       setCurrentPlayer(player);
  //     });
  // }, [gameSettings]);

  useEffect(() => {
    if (gameSettings?.player) {
      setCurrentPlayer({ name: gameSettings.player.name, id: '1' });
    }
  }, [gameSettings]);

  // console.log(gameSettings, currentPlayer);

  useEffect(() => {
    if (gameSettings && currentPlayer) {
      if (gameSettings.mode === GameMode.Multi) {
        const opponentService = new OpponentService();
        opponentService.register(currentPlayer.id);
        opponentService.getOpponent(currentPlayer.id).then((opponentPlayer) => {
          setOpponent(new MultiplayerOpponent(opponentService, opponentPlayer));
        });
      } else {
        setOpponent(new SimpleAI());
      }
    }
  }, [gameSettings, currentPlayer]);

  const renderGame = () =>
    gameSettings && opponent ? (
      <Game
        myName={gameSettings?.player?.name ?? 'Игрок 1'}
        mode={gameSettings?.mode ?? GameMode.Single}
        opponent={opponent}
      ></Game>
    ) : (
      <WelcomeScreen
        onWelcomeScreenSubmit={handleWelcomeScreenSubmit}
      ></WelcomeScreen>
    );

  return <div className="h-full">{renderGame()}</div>;
};

export default Daldoza;
