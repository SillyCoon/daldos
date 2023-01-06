import { v4 } from 'uuid';

interface RadioProps {
  label: string;
  name?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const Radio = ({ label, name, value, onChange }: RadioProps) => {
  const id = v4();
  return (
    <div>
      <input
        className="cursor-pointer"
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      ></input>
      <label htmlFor={id} className="ml-3 cursor-pointer">
        {label}
      </label>
    </div>
  );
};
