import { Button } from './Button';

interface ControlsProps {
  onRoll: () => void;
  disabled: boolean;
}

export const Controls = ({ onRoll, disabled }: ControlsProps) => {
  return (
    <div>
      <Button
        onClick={() => onRoll()}
        disabled={disabled}
        className="w-16 h-16 bg-blue-500 text-white disabled:bg-blue-100"
      >
        Roll
      </Button>
      <Button
        className="w-16 h-16 bg-blue-400 text-white disabled:bg-blue-100"
        disabled={disabled}
      >
        Undo
      </Button>
    </div>
  );
};
