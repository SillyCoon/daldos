import styled from 'styled-components';

interface ControlsProps {
  onRoll: () => void;
  disabled: boolean;
}

const RollButton = styled.button`
  width: 60px;
  height: 60px;
  background: brown;
  color: white;
  border: none;
  :disabled {
    background: #e6d9d9;
  }
`;

const UndoButton = styled.button`
  width: 60px;
  height: 60px;
  background: #d81010;
  color: white;
  border: none;
  :disabled {
    background: #e6d9d9;
  }
`;

export const Controls = ({ onRoll, disabled }: ControlsProps) => {
  return (
    <div>
      <RollButton onClick={() => onRoll()} disabled={disabled}>
        Roll
      </RollButton>
      <UndoButton disabled={disabled}>Undo</UndoButton>
    </div>
  );
};
