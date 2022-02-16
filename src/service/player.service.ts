import { Player, PlayerDto } from '../model/player';
import http from '../logic/communication/http';

export namespace PlayerService {
  export const registerPlayer = (player: PlayerDto): Promise<Player> =>
    http.post<Player>('/players', player).then((r) => r.data);
}
