import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import connectWs from '../logic/communication/ws';

export class OpponentService {
  private ws: Socket<DefaultEventsMap, DefaultEventsMap> = connectWs();

  constructor() {}

  disconnect() {
    this.ws.disconnect();
  }
}
