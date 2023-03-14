import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Container, Stack, Modal } from 'react-bootstrap';

export default function WelcomeForm({ handleLogin }){
  const [show, setShow] = useState(false);
  const [logState, setLogState]  = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  function handleClose(){
    setShow(false);
  };

  function handleShow(){
    setShow(true);
  };  
  
  function handleLogChange(e){
    setLogState({
      ...logState,
      [e.target.name]: e.target.value,
    });
  };

  function sendLogin(e){
    e.preventDefault();
    handleLogin(logState);
    setShow(false);
    navigate('/');
  };
    
  return (
    <Container id='loginCont'>
      <Link id="link" onClick={handleShow}>Login</Link>
      <Form  autoComplete="off">
        <Modal show={show} onHide={handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>Login To Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack>
              <Form.Group>
                <Form.Control
                  type="username"
                  placeholder="Username"
                  name="username"
                  value={logState.username}
                  onChange={handleLogChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={logState.password}
                  onChange={handleLogChange}
                  required
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={sendLogin}>
              Login
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );   
}