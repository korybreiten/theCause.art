import React, { useState, useEffect} from 'react';

import { Card, Container, Stack, Image } from 'react-bootstrap'


export default function CauseDisplayCard({ cause, idx }) {
  const [time, setTime] = useState(Date.now());
  const total = (cause.start + (10000 * cause.time)) - (time / 1000);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <Container id='causeDisplayCont'>
      <Card id='causeDisplayCard' key={ idx }>
        <Card.Body>
          <Stack direction='horizontal'>
            <Image src={ cause.icon } alt='' id='avatar' />
            <Stack>
              <strong>Name: { cause.name }</strong>
              <strong>About: { cause.description }</strong>
              <strong>Creator: { cause.owner }</strong>
              <strong>Funds: ${ cause.funds }</strong>
              <Stack direction='horizontal'>
                <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
                <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
              </Stack>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}