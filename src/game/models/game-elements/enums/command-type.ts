import { EnumGenerator } from '../../../logic/enum-generator';

export const CommandType = EnumGenerator.generate('Move', 'Activate', 'Roll', 'Save', 'PickFigure');

// todo: temp solution for enums
export const enum CommandTypeEnum {
  Move,
  Activate,
  Roll,
  Save,
  PickFigure
};
