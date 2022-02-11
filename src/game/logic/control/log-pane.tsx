import { Container } from './container';

export class LogPane extends Container {
  constructor() {
    const logHeader = document.createElement('h3');

    logHeader.textContent = 'Лог:';
    super('log-pane');
    this.appendElement(logHeader);
  }

  // TODO: remove any
  log(event: any) {
    const logItem = document.createElement('p');
    logItem.textContent = event.toString();
    this.appendElement(logItem);
  }
}
