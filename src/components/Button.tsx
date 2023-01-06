interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: string;
  className?: string;
}

export const Button = ({
  type,
  disabled,
  onClick,
  children,
  className,
}: ButtonProps) => (
  <button
    className={className}
    type={type ?? 'button'}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
