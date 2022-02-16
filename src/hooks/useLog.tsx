import { useState } from 'react';
import { Color } from '../model/color';
import { LogEvent } from '../model/log-event';

export const useLog = (): [
  events: LogEvent[],
  setEvent: (color: Color, message: string) => void,
] => {
  const [val, setVals] = useState<LogEvent[]>([]);

  return [
    val,
    (color: Color, message: string) =>
      setVals([{ player: color, message }, ...val]),
  ];
};
