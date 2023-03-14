import React, { useState } from 'react';
import ErrorMessage from '../System/ErrorMessage';
import { Button, Form, Container, Stack, Modal } from 'react-bootstrap';
import userService from '../../utils/userService';

export default function ProfileEmailForm({ profileData, handleGetProfile }){
  const [emailState, setEmailState]  = useState({ email: profileData.email });
  const [show, setShow] = useState(false);

  function handleClose(){
    setShow(false);
  };

  function handleShow(){
    setShow(true);
  };
  
  function handleEmailChange(e){
    setEmailState({
      ...emailState,
      [e.target.name]: e.target.value,
    });
  };

  async function handleUpdateEmail(e){
    e.preventDefault();
    try {
      const formData = { email: emailState.email, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      handleClose();
    } catch (err) {
      console.log(err.message);
    };
  };
    
  return (
    <Container style={{width: 'auto'}}>
      <Button id='editBioButton' variant="primary" onClick={handleShow}>
        Edit
      </Button>
      <Form  autoComplete="off">
        <Modal show={show} onHide={handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={emailState && emailState.email ? emailState.email : ''}
                  onChange={handleEmailChange}
                  required
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleUpdateEmail}>
              Save
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