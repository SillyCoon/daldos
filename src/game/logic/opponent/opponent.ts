import { App } from '../app';
import { Command } from '../commands/command';

export interface Opponent {
  name: string;
  order: number;
  getCommandFor(app: App): Promise<Command>;
  send(command: Command): Promise<void>;
}
