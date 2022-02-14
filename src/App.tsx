import styled from 'styled-components';
import { DaldozaProps, Game } from './components/Game';
import { ReactAI } from './components/logic/reactAi';
import { GameModeEnum } from './game/models/game-elements/enums/game-mode';

const Navbar = styled.div`
  width: 100%;
  height: 50px;
  background-color: red;
  margin-bottom: 10px;
`;

function App() {
  const daldozaProps: DaldozaProps = {
    myName: 'player',
    mode: GameModeEnum.AI,
    opponent: new ReactAI(),
  };

  return (
    <div className="App">
      {/* <Navbar></Navbar> */}
      <Game
        myName={daldozaProps.myName}
        mode={daldozaProps.mode}
        opponent={daldozaProps.opponent}
      ></Game>
    </div>
  );
}

export default App;
