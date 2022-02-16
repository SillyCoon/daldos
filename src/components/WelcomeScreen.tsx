import { useFormik } from 'formik';
import { GameMode } from '../model/enums/game-mode';
import { PlayerDto } from '../model/player';

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
    <form onSubmit={formik.handleSubmit}>
      <label>
        Your Name:
        <input
          id="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name}
        />
      </label>
      <h1>Select game type:</h1>
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
      <button type="submit" disabled={!(formik.isValid && formik.dirty)}>
        Play!
      </button>
    </form>
  );
};
