import { Button } from './Button';

interface PrimaryButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const PrimaryButton = ({ type, disabled }: PrimaryButtonProps) => (
  <Button
    type={type}
    disabled={disabled}
    className="disabled:bg-blue-300 border-solid bg-blue-500 text-white border-1 px-2 py-1 rounded-md border-blue-700"
  >
    Play!
  </Button>
);
