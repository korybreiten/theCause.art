import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Stack, Image } from 'react-bootstrap';


export default function SearchDisplayCard({ result, idx, sendGetUser }) {
  function handleGetUser(){
    sendGetUser({username: result.username});
  };

  return (
    <Container id='searchDisplayCont'>
      <Link id="link" className="ms-auto" to={ '/' + result.username } onClick={handleGetUser}>
        <Card id='searchDisplayCard' key={idx}>
          <Card.Body>
            <Stack direction='horizontal'>
              <Image src={ result.avatar } alt='' id='avatar' />
              <Stack>
                <strong>{ result.username }</strong>
                <strong>{ result.email }</strong>
              </Stack>
            </Stack>
          </Card.Body>
        </Card>
      </Link>
    </Container>
  )
}