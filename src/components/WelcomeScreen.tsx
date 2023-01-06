import { useFormik } from 'formik';
import { GameMode } from '../model/enums/game-mode';
import { PlayerDto } from '../model/player';
import { PrimaryButton } from './PrimaryButton';
import { Radio } from './Radio';
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
        <TextInput
          label="Your Name:"
          name="name"
          value={formik.values.name}
          handleChange={formik.handleChange}
        ></TextInput>
        <div id="mode-selector" className="flex flex-col mb-5 mt-3">
          <Title>Select game type:</Title>
          <Radio
            name="mode"
            label="Single"
            value={GameMode.Single}
            onChange={formik.handleChange}
          ></Radio>
          <Radio
            name="mode"
            label="AI"
            value={GameMode.AI}
            onChange={formik.handleChange}
          ></Radio>
          {/* <Radio
            name="mode"
            label="Multiplayer"
            value={GameMode.Multi}
            onChange={formik.handleChange}
          ></Radio> */}
        </div>
        <PrimaryButton
          disabled={!(formik.isValid && formik.dirty)}
          type="submit"
        ></PrimaryButton>
      </form>
    </div>
  );
};
