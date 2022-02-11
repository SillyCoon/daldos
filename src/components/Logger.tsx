interface LoggerProps {
  events: any[];
}

export const Logger = ({ events }: LoggerProps) => {
  const logs = events.map((e) => <p>{e.toString()}</p>);

  return (
    <div>
      <h3>Лог:</h3>
      {logs}
    </div>
  );
};
