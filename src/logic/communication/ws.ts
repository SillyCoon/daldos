import { io } from 'socket.io-client';

const connectWs = () => {
  console.log('connecting to MP...');
  const ws = io('http://localhost:3000');
  ws.on('connect', () => console.log('connected to MP'));
  return ws;
};

export default connectWs;
