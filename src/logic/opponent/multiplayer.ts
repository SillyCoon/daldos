// import { RollCommand } from '../commands/roll-command';
// import { MoveCommand } from '../commands/move-command';
// import { ActivateCommand } from '../commands/activate-command';
// import {
//   CommandType,
//   CommandTypeEnum,
// } from '../../models/game-elements/enums/command-type';
// import { OppositeRollCommand } from '../commands/opposite-roll-command';
// import { Command } from '../commands/command';
// import { App } from '../app';
// import { Observable } from 'rxjs';

import { Command } from '../../model/command';
import { GameState } from '../../model/game-state';
import { OpponentService } from '../../service/opponent.service';
import { Opponent } from './opponent';

export class MultiplayerOpponent implements Opponent {
  name: string = '123';
  order: number = 2;

  constructor(private service: OpponentService) {}

  getCommandFor(state: GameState): Promise<Command> {
    throw new Error('Method not implemented.');
  }

  send(command: Command | null): Promise<void> {
    throw new Error('Method not implemented.');
  }

  disconnect() {
    this.disconnect();
  }

  static create(): MultiplayerOpponent {
    const service = new OpponentService();
    return new MultiplayerOpponent(service);
  }
}

// interface SocketCommand {
//   commandType: CommandTypeEnum;
// }

// interface SocketData<T extends string, A> {
//   type: T;
//   value: A;
// }

// type Order = 1 | 2;
// type OrderCommand = SocketData<'order', Order>;
// type MpCommand = SocketData<'command', SocketCommand>;

// export class SocketMultiplayer {
//   socket: WebSocket;

//   name: string = '';
//   order: Order = 1;

//   constructor(url = 'ws://localhost:8000/ws/') {
//     this.socket = new WebSocket(url);
//     this.socket.onopen = (ev) => {
//       console.log(`connection opened!`);
//     };
//     this.socket.onclose = () => alert('connection closed!');
//   }

//   assignOrder(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.socket.onopen = () => {
//         this.socket.send(JSON.stringify({ type: 'order' }));
//         this.receive().then(() => resolve());
//       };
//     });
//   }

//   send(command: Command): Promise<void> {
//     return new Promise((resolve, reject) => {
//       let message;
//       if (command instanceof RollCommand) {
//         message = this.makeRoll(command);
//       } else if (command instanceof ActivateCommand) {
//         message = this.makeActivate(command);
//       } else if (command instanceof MoveCommand) {
//         message = this.makeMove(command);
//       }
//       this.socket.send(JSON.stringify(message));
//       resolve();
//     });
//   }

//   getCommandFor(app: App) {
//     return this.receive().then((action: Action) => {
//       return new Promise((resolve, reject) => {
//         switch (action.commandType) {
//           case CommandTypeEnum.Activate:
//             resolve(
//               new ActivateCommand(
//                 app,
//                 app.currentState,
//                 action.actionCoordinate,
//               ),
//             );
//           case CommandTypeEnum.Roll:
//             resolve(
//               new OppositeRollCommand(app, app.currentState, action.dices),
//             );
//           case CommandTypeEnum.Move:
//             resolve(
//               new MoveCommand(app, app.currentState, {
//                 from: action.from,
//                 to: action.to,
//               }),
//             );
//         }
//       });
//     });
//   }

//   receive(): Promise<Order | SocketCommand> {
//     return new Promise((resolve, _) => {
//       this.socket.onmessage = (
//         message: MessageEvent<OrderCommand | MpCommand>,
//       ) => {
//         const data = message.data;

//         if (data.type === 'order' && typeof data.value === 'number') {
//           this.order = data.value;
//           this.name = `Игрок ${this.order}`;
//           resolve(this.order);
//           console.log(`Opponent is: ${data.value}`);
//         } else if (data.type === 'command') {
//           resolve(data.value);
//         }
//       };
//     });
//   }

//   makeActivate(command) {
//     const activateMessage = {
//       commandType: CommandType.Activate,
//       actionCoordinate: command.actionCoordinate,
//     };
//     return activateMessage;
//   }

//   makeMove(command) {
//     const from = command.from
//       ? command.from
//       : command.gameState.selectedFigure.coordinate;
//     const moveMessage = {
//       commandType: CommandType.Move,
//       from,
//       to: command.actionCoordinate,
//     };
//     return moveMessage;
//   }

//   makeRoll(command) {
//     const rollMessage = {
//       commandType: CommandType.Roll,
//       dices: command.skippedDices
//         ? command.skippedDices
//         : command.app.currentState.dices,
//     };
//     return rollMessage;
//   }
// }
