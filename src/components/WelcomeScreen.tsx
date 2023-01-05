import { useFormik } from 'formik';
import { GameMode } from '../model/enums/game-mode';
import { PlayerDto } from '../model/player';
import { TextInput } from './TextInput';
import { Title } from './Title';

export interface GameTypeSelectorProps {
  onWelcomeScreenSubmit: (name: PlayerDto, mode: GameMode) => void;
}

export const WelcomeScreen = ({
  onWelcomeScreenSubmit: onGameModeChange,
}: GameTypeSelectorProps) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      mode: null,
    },
    onSubmit: ({ name, mode }) => {
      onGameModeChange({ name }, mode ?? GameMode.Single);
    },
    validate: ({ name, mode }) =>
      !name || !mode ? { errors: 'not selected' } : {},
  });

  return (
    <div>
      <Title>Let's get started</Title>
      <form onSubmit={formik.handleSubmit}>
        <label>
          <span className="mr-5">Your Name:</span>
          <TextInput
            name="name"
            value={formik.values.name}
            handleChange={formik.handleChange}
          ></TextInput>
        </label>
        <Title>Select game type:</Title>
        <div id="mode-selector">
          <label>
            Single
            <input
              type="radio"
              name="mode"
              value={GameMode.Single}
              onChange={formik.handleChange}
            ></input>
          </label>
          <label>
            AI
            <input
              type="radio"
              name="mode"
              value={GameMode.AI}
              onChange={formik.handleChange}
            ></input>
          </label>
          <label>
            Multiplayer
            <input
              type="radio"
              name="mode"
              value={GameMode.Multi}
              onChange={formik.handleChange}
            ></input>
          </label>
        </div>
        <button
          className="disabled:bg-blue-300 border-solid bg-blue-500 text-white border-1 px-2 py-1 rounded-md border-blue-700"
          type="submit"
          disabled={!(formik.isValid && formik.dirty)}
        >
          Play!
        </button>
      </form>
    </div>
  );
};
