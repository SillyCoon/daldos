import { ChangeEventHandler, FocusEventHandler } from 'react';

interface TextInputProps {
  name: string;
  value?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  handleBlur?: FocusEventHandler<HTMLInputElement>;
  label: string;
}

export const TextInput = ({
  name,
  value,
  handleChange,
  handleBlur,
  label,
}: TextInputProps) => (
  <div>
    <label className="mr-5">{label}</label>
    <input
      className="disabled:border-blue-300 border-solid border-2 p-1 rounded-md border-blue-500 focus:border-blue-600 focus-visible:border-blue-200"
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  </div>
);
