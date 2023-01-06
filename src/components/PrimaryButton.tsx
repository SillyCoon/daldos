interface PrimaryButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const PrimaryButton = ({ type, disabled }: PrimaryButtonProps) => (
  <button
    className="disabled:bg-blue-300 border-solid bg-blue-500 text-white border-1 px-2 py-1 rounded-md border-blue-700"
    type="submit"
    disabled={disabled}
  >
    Play!
  </button>
);
