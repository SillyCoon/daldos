// import { RollCommand } from './commands/roll-command';
// import { MoveCommand } from './commands/move-command';
// import { ActivateCommand } from './commands/activate-command';
// import { LogRecord } from '../models/game-elements/log/log-record';

export const HttpLogger = () => {};

// export class HttpLogger {
//   baseUrl: string;
//   endpoints: string[];

//   constructor(baseUrl: string, endpoints: string[]) {
//     this.baseUrl = baseUrl;
//     this.endpoints = endpoints;
//   }

//   logCommand(command: any) {
//     if (command instanceof RollCommand) {
//       const rollLogRecord: LogRecord = {
//         player: command.gameState.currentPlayerColor,
//         type: 'Roll',
//         params: { dices: command.app.currentState.dices },
//       };
//       this.logRoll(rollLogRecord);
//     } else if (command instanceof MoveCommand) {
//       const from = command.from
//         ? command.from
//         : command.gameState.selectedFigure.coordinate;
//       const moveLogRecord = new LogRecord(
//         command.gameState.currentPlayerColor,
//         'Move',
//         { from, to: command.actionCoordinate },
//       );
//       this.logMove(moveLogRecord);
//     } else if (command instanceof ActivateCommand) {
//       const activateRollRecord = new LogRecord(
//         command.gameState.currentPlayerColor,
//         'Activate',
//         { actionCoordinate: command.actionCoordinate },
//       );
//       this.logActivate(activateRollRecord);
//     }
//   }

//   logActivate(activate) {
//     return this._logRequest(this.endpoints.activate, activate);
//   }

//   logMove(move) {
//     return this._logRequest(this.endpoints.move, move);
//   }

//   logRoll(roll) {
//     return this._logRequest(this.endpoints.roll, roll);
//   }

//   _logRequest(endpoint, item) {
//     return fetch(`${this.baseUrl}${endpoint}`, {
//       method: 'POST',
//       body: JSON.stringify(item),
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//       },
//     });
//   }
// }
