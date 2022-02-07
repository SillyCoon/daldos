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

interface LogPaneProps {
  events: any[];
}

export const LogPaneComponent = ({ events }: LogPaneProps) => {
  const logs = events.map((e) => <p>{e.toString()}</p>);

  return (
    <div>
      <h3>Лог:</h3>
      {logs}
    </div>
  );
};
