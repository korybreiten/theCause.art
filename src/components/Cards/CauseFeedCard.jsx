import React, { useState, useEffect} from 'react';

import { Card, Container, Stack, Image, ProgressBar } from 'react-bootstrap'


export default function CauseFeedCard({ cause, idx }) { 
  const [time, setTime] = useState(Date.now());
  const total = (cause.start + (604800 * cause.time)) - (time / 1000);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container id='causeFeedCont'>
      <Card id='causeFeedCard' key={idx}>
        <Card.Body>
          <Stack direction='horizontal'>
            {cause.icon ? <Image src={ cause.icon } alt='' id='causeIcon' /> : <Image src={ '/icons/image.svg' } alt='' id='causeIcon' />}
            <Stack style={{width: '19rem'}}>
              <strong>{cause.name}</strong>
              <strong>${cause.funds} / ${cause.goal}</strong>
              <Stack direction='horizontal'>
                <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
                <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
              </Stack>
            </Stack>
            <ProgressBar now={cause.funds / cause.goal * 100} />
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}