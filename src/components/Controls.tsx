interface ControlsProps {
  onRoll: () => void;
  disabled: boolean;
}

export const Controls = ({ onRoll, disabled }: ControlsProps) => {
  return (
    <div>
      <button onClick={() => onRoll()} disabled={disabled}>
        Roll
      </button>
      <button disabled={disabled}>Undo</button>
    </div>
  );
};
