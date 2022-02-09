import { EnumGenerator } from '../../../logic/enum-generator';

export const GameStatus = EnumGenerator.generate(
  'Playing',
  'ExtraMove',
  'FirstWin',
  'SecondWin',
  'NoMoves',
);

export const enum GameStatusEnum {
  Playing,
  ExtraMove,
  FirstWin,
  SecondWin,
  NoMoves,
}
