import { BaseControl } from './base-control';
import { fromEvent } from 'rxjs';

interface ButtonConfig {
  name: string,
  disabled: boolean;
};

export class Button implements BaseControl {

  nativeElement: HTMLButtonElement;

  constructor({ name, disabled = false }: ButtonConfig, _className = null, _handler = null) {
    const nativeButton = document.createElement('button');
    nativeButton.id = `btn-${name}`;
    nativeButton.textContent = name;
    nativeButton.disabled = disabled;
    this.nativeElement = nativeButton;
  }

  handleClick() {
    return fromEvent(this.nativeElement, 'click');
  }

  enable() {
    this.nativeElement.disabled = false;
  }

  disable() {
    this.nativeElement.disabled = true;
  }
}
