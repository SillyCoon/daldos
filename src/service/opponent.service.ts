import { Socket } from 'socket.io-client';
import { EventsMap } from 'socket.io/dist/typed-events';
import connectWs from '../logic/communication/ws';
import { Player } from '../model/player';

interface GameListenEventsMap extends EventsMap {
  opponent: (player: Player) => void;
}

interface GameEmitEventsMap extends EventsMap {
  opponent: void;
}

export class OpponentService {
  private ws: Socket<GameListenEventsMap, GameEmitEventsMap> = connectWs();

  constructor() {}

  getOpponent(): Promise<Player> {
    return new Promise((resolve, reject) => {
      this.ws.emit('opponent').on('opponent', (opponent: Player) => {
        resolve(opponent);
      });
    });
  }

  disconnect() {
    this.ws.disconnect();
  }
}
