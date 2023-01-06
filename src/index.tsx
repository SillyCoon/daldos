import './index.css';
import Daldoza from './Daldoza';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Daldoza />);
