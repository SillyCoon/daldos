import { LogEvent } from '../model/log-event';

interface LoggerProps {
  events: LogEvent[];
}

export const Logger = ({ events }: LoggerProps) => {
  const logs = events.slice(0, 5).map((e, id) => (
    <p key={id}>
      Игрок {e.player} {e.message}
    </p>
  ));

  return (
    <div>
      <h3>Лог:</h3>
      <div className="p-2 border-2 border-solid max-h-20 h-20 overflow-y-auto">
        {logs}
      </div>
    </div>
  );
};
