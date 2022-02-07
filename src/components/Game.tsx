import { useEffect } from 'react';
import './game.css';
import { App as Daldoza } from '../game/logic/app';
import { Container } from '../game/logic/control/container';
import { PrimitiveAI } from '../game/logic/opponent/primitive-AI';
import styled from 'styled-components';


export const RawGame = () => {

  useEffect(() => {
    const container = new Container('game-container');
    document.body.appendChild(container.nativeElement);
    const app = new Daldoza(container, 'player', { mode: 0 }, new PrimitiveAI());
    app.start();
  });

  return <></>;
};

export const Game = styled(RawGame)`
`;
