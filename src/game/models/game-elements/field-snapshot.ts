import { NotationEnum } from './enums/notation';

export class FieldSnapshot {
  value: string;

  constructor(fieldNotation: string) {
    this.value = fieldNotation;
  }

  get size() {
    return this.splittedByColumns[0].length;
  }

  get splittedByColumns() {
    return this.value.split(NotationEnum.Delimiter);
  }
}
