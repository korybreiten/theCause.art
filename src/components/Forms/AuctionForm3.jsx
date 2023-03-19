import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ErrorMessage from '../System/ErrorMessage';
import imageService from '../../utils/imageService';
import userService from '../../utils/userService';
import auctionService from '../../utils/auctionService';
import AuctionImageForm1 from './AuctionImageForm1';
import AuctionImageForm2 from './AuctionImageForm2';
import AuctionImageForm3 from './AuctionImageForm3';

import { Button, Form, Container, Stack, Modal, Image, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';


export default function ProfileAuctionForm3({ profileData, handleGetProfile }){
  let id = profileData.auction3;
  const [invalid, setInvalid] = useState(true);
  const [auctionState, setAuctionState]  = useState({
    id: id,
    name: '',
    width: 0,
    height: 0,
    depth: 0,
    start: 0,
    time: 0,
    funds: 0,
    image1: '',
    image2: '',
    image3: ''
  });

  let start = 0;
  let duration = 0;
  if (auctionState) {
    start = auctionState.start;
    duration = auctionState.time;
  };

  const [time, setTime] = useState(Date.now());
  const total = (start + (604800 * duration)) - (time / 1000);

  const [showUpdate, setShowUpdate] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showStop, setShowStop] = useState(false);

  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);


  function handleClose(){
    setShowUpdate(false);
    setShowStart(false);
    setShowStop(false);
  };

  function handleAuctionTime(time){
    setAuctionState({...auctionState, time: time})
    if (time === 2) {
      setActive2(false);
      setActive1(true);
    };
    if (time === 4) {
      setActive1(false);
      setActive2(true);
    };
  };

  function handleAuctionChange(e){
    setInvalid(false);
    setAuctionState({
      ...auctionState,
      [e.target.name]: e.target.value,
    });
  };

  async function handleAuctionCreate(){
    try {
      const auctionId = await auctionService.create({
        creator: profileData.id
      });
      const formData = { auction3: auctionId, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      handleGetAuctionData();
      setShowStart(true);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleAuctionStart(){
    try {
      const startDate = Math.floor(Date.now() / 1000);
      const formData = {
        id: id,
        name: auctionState.name,
        width: auctionState.width,
        height: auctionState.height,
        depth: auctionState.depth,
        start: startDate,
        time: auctionState.time,
        funds: auctionState.funds
      }
      await auctionService.update(formData);
      handleGetProfile();
      handleGetAuctionData();
      handleClose();
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleAuctionUpdate(){
    try {
      if (id > 0) {
        const formData = {
          id: id,
          name: auctionState.name,
          width: auctionState.width,
          height: auctionState.height,
          depth: auctionState.depth,
          funds: auctionState.funds
        }
        await auctionService.update(formData);
        handleGetProfile();
        handleGetAuctionData();
        handleClose();
      }
    } catch (err) {
      console.log(err.message);
    };
  };

  function handleShowStop(){
    handleClose();
    setShowStop(true);
  }

  async function handleAuctionStop(){
    try {
      if (id){
        await auctionService.remove(id);
      }

      setAuctionState({
        id: 0,
        name: '',
        width: 0,
        height: 0,
        depth: 0,
        start: 0,
        time: 0,
        funds: 0,
        image1: '',
        image2: '',
        image3: ''
      });

      await auctionService.remove(id);
      const formData = { auction3: 0, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      setActive1(false);
      setActive2(false);
      handleClose();
    } catch (err) {
      console.log(err.message)
    };
  };

  async function handleGetAuctionData(){
    try {
      const formData = {id: id};
      const data = await auctionService.getOne(formData);
      setAuctionState(data);
    } catch (err) {
        console.log(err.message)
    };
  };

  useEffect(() => {
    handleGetAuctionData();
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
    
  return (
    <Container>
      
      <Form  autoComplete="off">
        <Modal
          show={showStart}
          onHide={handleAuctionStop}
        >
          <Modal.Header closeButton>
            <Modal.Title>Start Auction 3</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={auctionState && auctionState.name ? auctionState.name : ''}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inches Wide</Form.Label>
              <Form.Control
                type="number"
                placeholder="Width"
                name="width"
                value={auctionState && auctionState.width ? auctionState.width : 0}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inches High</Form.Label>
              <Form.Control
                type="number"
                placeholder="Height"
                name="height"
                value={auctionState && auctionState.height ? auctionState.height : 0}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inches Deep</Form.Label>
              <Form.Control
                type="number"
                placeholder="Depth"
                name="depth"
                value={auctionState && auctionState.depth ? auctionState.depth : 0}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Funds</Form.Label>
              <Form.Control
                type="number"
                placeholder="Funds"
                name="funds"
                value={auctionState && auctionState.funds ? auctionState.funds : 0}
                onChange={handleAuctionChange}
              />
            </Form.Group>
            <ToggleButtonGroup name='time'>
              <ToggleButton onClick={() => handleAuctionTime(2)} active={active1}>
                2 Weeks
              </ToggleButton>
              <ToggleButton onClick={() => handleAuctionTime(4)} active={active2}>
                4 Weeks
              </ToggleButton>
            </ToggleButtonGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleAuctionStart} disabled={invalid}>
              Start
            </Button>
            <Button variant="secondary" onClick={handleAuctionStop}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>

      <Form  autoComplete="off">
        <Modal show={showUpdate} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Auction 3</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={auctionState && auctionState.name ? auctionState.name : ''}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inches Wide</Form.Label>
              <Form.Control
                type="number"
                placeholder="Width"
                name="width"
                value={auctionState && auctionState.width ? auctionState.width : 0}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inches High</Form.Label>
              <Form.Control
                type="number"
                placeholder="Height"
                name="height"
                value={auctionState && auctionState.height ? auctionState.height : 0}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inches Deep</Form.Label>
              <Form.Control
                type="number"
                placeholder="Depth"
                name="depth"
                value={auctionState && auctionState.depth ? auctionState.depth : 0}
                onChange={handleAuctionChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={handleShowStop}>
              Stop
            </Button>
            <Button variant='primary' onClick={handleAuctionUpdate}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>

      <Form  autoComplete="off">
        <Modal show={showStop} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Stop Auction 3</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to stop this auction?</h4>
            {auctionState && auctionState.funds > 0 ? <h5>Highest active bid will win auction!</h5> : <h5>There are no active bids so you can safely continue.</h5>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleAuctionStop}>
              Stop
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
      
      <h3>Auction 3</h3>
      <Container>
        {id ? 
          <Stack direction='horizontal'>
            <AuctionImageForm1 auctionState={auctionState} handleGetAuctionData={handleGetAuctionData} />
            <Stack>
              <AuctionImageForm2 auctionState={auctionState} handleGetAuctionData={handleGetAuctionData} />
              <AuctionImageForm3 auctionState={auctionState} handleGetAuctionData={handleGetAuctionData} />
            </Stack>
          </Stack>
        : null}
        {id ?
          <Stack>
            {auctionState && auctionState.name ? <h5>{auctionState.name}</h5> : <h5>Auction Name</h5>}
            <strong>{auctionState && auctionState.width ? auctionState.width : 0}w x {auctionState && auctionState.height ? auctionState.height : 0}h x {auctionState && auctionState.depth ? auctionState.depth : 0}d in.</strong>
            <strong>${auctionState && auctionState.funds ? auctionState.funds : 0}</strong>
          </Stack>
        : null}

        {auctionState && auctionState.start ?
          <Stack direction='horizontal'>
            <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
            <strong id='timerCenter'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
            <strong id='timerCenter'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
            <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
            <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
          </Stack>
        : <strong>Not Active</strong> }
      </Container>

      <Stack direction='horizontal'>
        {id ?
          <Button id='auctionEditButton' onClick={() => setShowUpdate(true)}>Update</Button>
        : <Button id='auctionEditButton' onClick={handleAuctionCreate}>Create</Button> }
      </Stack>
    </Container>        
  );   
}