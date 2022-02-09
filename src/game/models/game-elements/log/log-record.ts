import { Player } from '../player';

export interface LogRecord {
  player: Player;
  type: string;
  params: any;
}
