import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import ErrorMessage from '../System/ErrorMessage';
import auctionService from '../../utils/auctionService';
import imageService from '../../utils/imageService';
import userService from '../../utils/userService';

import { Button, Form, Container, Stack, Modal, Image } from 'react-bootstrap';

export default function AuctionImageForm2({ auctionState, handleGetAuctionData }){
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

  async function handleUpdateImage(e){
    e.preventDefault();
    try {
      let imageData = new FormData();
      imageData.append('image', selectedFile);
      const location = await imageService.saveImage(imageData);
      const formData = { image2: location, id: auctionState.id };
      await auctionService.update(formData);
      handleGetAuctionData();
      setShow(false);
    } catch (err) {
      console.log(err.message)
    };
  };
    
  return (
    <Container id='auctionSideCont'>
      { auctionState && auctionState.image2 ?
        <Container>
          <Image src={ auctionState.image2 } alt='' id='auctionSideProfile' />
          <Button id='editAuctionSideButton' onClick={handleShow}>
            <i id="editAuctionSideIcon" className="bi bi-camera-fill" />
          </Button>
        </Container>
      :
        <Container>
          <Image src={ '/icons/image.svg' } alt='' id='auctionSideProfile' />
          <Button id='editAuctionSideButton' onClick={handleShow}>
            <i id="editAuctionSideIcon" className="bi bi-camera-fill" />
          </Button>
        </Container>
      }
      
      <Form  autoComplete="off">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Auction Image 2</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { selectedFile ?
              <Image src={ URL.createObjectURL(selectedFile) } alt='' id='avatarProfile' /> :
              auctionState && auctionState.image2 ?
                <Image src={ auctionState.image2 } alt='' id='avatarProfile' /> :
                <Image src={ '/icons/image.svg' } alt='' id='avatarProfile' />
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
            <Button variant='primary' onClick={handleUpdateImage}>
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