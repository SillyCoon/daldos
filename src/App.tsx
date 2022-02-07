import styled from 'styled-components';
import { Game } from "./components/Game";


const Navbar = styled.div`
  width: 100%;
  height: 50px;
  background-color: red;
  margin-bottom: 10px;
`;

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Game></Game>
    </div>
  );
}

export default App;
