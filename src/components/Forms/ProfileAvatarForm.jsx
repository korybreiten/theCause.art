import React, { useState } from 'react';
import imageService from '../../utils/imageService';
import userService from '../../utils/userService';

import { Button, Form, Container, Modal, Image } from 'react-bootstrap';

export default function ProfileAvatarForm({ profileData, handleGetProfile }){
  const [selectedFile, setSelectedFile] = useState('');
  const [show, setShow] = useState(false);

  function handleClose(){
    URL.revokeObjectURL(selectedFile);
    setSelectedFile('');
    setShow(false);
  };

  function handleShow(){
    setShow(true);
  };

  function handleFileInput(e){
    setSelectedFile(e.target.files[0]);
  };

  async function handleUpdateAvatar(e){
    e.preventDefault();
    try {
      let imageData = new FormData();
      imageData.append('image', selectedFile);
      const location = await imageService.saveImage(imageData);
      const formData = { avatar: location, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      setShow(false);
    } catch (err) {
      console.log(err.message)
    };
  };
    
  return (
    <Container>
      { profileData && profileData.avatar ?
        <Container id='avatarCont'>
          <Image src={ profileData.avatar } alt='' id='avatarProfile' />
          <Button id='editAvatarButton' onClick={handleShow}>
            <i id="editAvatarIcon" className="bi bi-camera-fill" />
          </Button>
        </Container>
      : <Container id='avatarCont'>
          <Image src={ '/icons/profile.svg' } alt='' id='avatarProfile' />
          <Button id='editAvatarButton' onClick={handleShow}>
            <i id="editAvatarIcon" className="bi bi-camera-fill" />
          </Button>
        </Container>
      }
      
      <Form  autoComplete="off">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { selectedFile ?
              <Image src={ URL.createObjectURL(selectedFile) } alt='' id='avatarProfile' /> :
              profileData && profileData.avatar ?
                <Image src={ profileData.avatar } alt='' id='avatarProfile' /> :
                <Image src={ '/icons/profile.svg' } alt='' id='avatarProfile' />
            }
            <Form.Group>
              <Form.Control
                type="file"
                placeholder="Upload Image"
                onChange={handleFileInput}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleUpdateAvatar}>
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