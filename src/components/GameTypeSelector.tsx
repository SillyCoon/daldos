export interface GameTypeSelectorProps {
  onSingleClick: () => void;
  onAIClick: () => void;
}

export const GameTypeSelector = ({
  onSingleClick,
  onAIClick,
}: GameTypeSelectorProps) => {
  return (
    <div>
      <h1>Select game type:</h1>
      <button onClick={onSingleClick}>Single</button>
      <button onClick={onAIClick}>AI</button>
    </div>
  );
};
