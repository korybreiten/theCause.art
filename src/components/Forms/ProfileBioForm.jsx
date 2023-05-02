import React, { useState } from 'react';
import { Button, Form, Container, Stack, Modal } from 'react-bootstrap';
import userService from '../../utils/userService';

export default function ProfileBioForm({ profileData, handleGetProfile }){
  const [bioState, setBioState]  = useState({ bio: profileData.bio });
  const [show, setShow] = useState(false);

  function handleClose(){
    setShow(false);
  };
  
  function handleBioChange(e){
    setBioState({
      ...bioState,
      [e.target.name]: e.target.value,
    });
  };

  async function handleUpdateBio(e){
    e.preventDefault();
    try {
      const formData = { bio: bioState.bio, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      handleClose();
    } catch (err) {
      console.log(err.message);
    };
  };
    
  return (
    <Container style={{width: 'auto'}}>
      <Button id='editBioButton' variant="primary" onClick={() => setShow(true)}>
        Edit
      </Button>
      <Form  autoComplete="off">
        <Modal show={show} onHide={handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Bio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Bio"
                  name="bio"
                  value={bioState.bio}
                  onChange={handleBioChange}
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleUpdateBio}>
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