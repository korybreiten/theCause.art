import React, { useState } from 'react';
import { Button, Form, Container, Stack, Modal } from 'react-bootstrap';
import userService from '../../utils/userService';

export default function ProfilePaypalClientIdForm({ profileData, handleGetProfile }){
  const [clientIdState, setClientIdState]  = useState({ clientId: profileData.clientId });
  const [show, setShow] = useState(false);

  function handleClose(){
    setShow(false);
  };

  function handleShow(){
    setShow(true);
  };
  
  function handleClientIdChange(e){
    setClientIdState({
      ...clientIdState,
      [e.target.name]: e.target.value,
    });
  };

  async function handleUpdateClientId(e){
    e.preventDefault();
    try {
      const formData = { clientId: clientIdState.clientId, id: profileData.id };
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
            <Modal.Title>Edit Profile Payal Client Id</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="Paypal Client Id"
                  name="clientId"
                  value={clientIdState && clientIdState.clientId ? clientIdState.clientId : ''}
                  onChange={handleClientIdChange}
                  required
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleUpdateClientId}>
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