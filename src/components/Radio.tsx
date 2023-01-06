interface RadioProps {
  label: string;
  name?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const Radio = ({ label, name, value, onChange }: RadioProps) => (
  <div>
    <input type="radio" name={name} value={value} onChange={onChange}></input>
    <label className="ml-3">{label}</label>
  </div>
);
