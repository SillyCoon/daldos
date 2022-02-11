interface ControlsProps {
  onRoll: () => void;
}

export const Controls = ({ onRoll }: ControlsProps) => {
  return (
    <div>
      <button onClick={() => onRoll()}>Roll</button>
      <button>Undo</button>
    </div>
  );
};
