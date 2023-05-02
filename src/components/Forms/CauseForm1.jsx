import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ErrorMessage from '../System/ErrorMessage';
import imageService from '../../utils/imageService';
import userService from '../../utils/userService';
import causeService from '../../utils/causeService';
import CauseIconForm from './CauseIconForm';

import { Button, Form, Container, Stack, Modal, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';


export default function CauseForm1({ profileData, handleGetProfile }){
  let id = profileData.cause1;
  const [invalid, setInvalid] = useState(true);
  const [causeState, setCauseState]  = useState({
    id: id,
    name: '',
    about: '',
    funds: 0,
    goal: 0,
    start: 0,
    time: 0
  });

  let start = 0;
  let duration = 0;
  if (causeState) {
    start = causeState.start;
    duration = causeState.time;
  };

  const [time, setTime] = useState(Date.now());
  const total = (start + (10000 * duration)) - (time / 1000); // 604800 = 1 Week

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

  function handleCauseTime(time){
    setCauseState({...causeState, time: time})
    if (time === 2) {
      setActive2(false);
      setActive1(true);
    };
    if (time === 4) {
      setActive1(false);
      setActive2(true);
    };
  };

  function handleCauseChange(e){
    setInvalid(false);
    setCauseState({
      ...causeState,
      [e.target.name]: e.target.value,
    });
  };

  async function handleCauseCreate(){
    try {
      const causeId = await causeService.create({
        creator: profileData.id
      });
      const formData = { cause1: causeId, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      handleGetCauseData();
      setShowStart(true);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleCauseStart(){
    try {
      const startDate = Math.floor(Date.now() / 1000);
      const formData = {
        id: id,
        name: causeState.name,
        about: causeState.about,
        goal: causeState.goal,
        funds: causeState.funds,
        start: startDate,
        time: causeState.time,
        status: 'ACTIVE'
      }
      await causeService.update(formData);
      handleGetProfile();
      handleGetCauseData();
      handleClose();
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleCauseUpdate(){
    try {
      if (id > 0) {
        const formData = {
          id: id,
          name: causeState.name,
          about: causeState.about,
          goal: causeState.goal,
          funds: causeState.funds
        }
        await causeService.update(formData);
        handleGetProfile();
        handleGetCauseData();
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

  async function handleCauseStop(){
    try {
      if (id){
        await causeService.remove(id);
      }

      setCauseState({
        id: 0,
        name: '',
        about: '',
        funds: 0,
        goal: 0,
        start: 0,
        time: 0
      });

      await causeService.remove(id);
      const formData = { cause1: 0, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      setActive1(false);
      setActive2(false);
      handleClose();
    } catch (err) {
      console.log(err.message)
    };
  };

  async function handleGetCauseData(){
    try {
      const formData = {id: id};
      const data = await causeService.getOne(formData);
      setCauseState(data);
    } catch (err) {
        console.log(err.message)
    };
  };

  useEffect(() => {
    handleGetCauseData();
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
          onHide={handleCauseStop}
        >
          <Modal.Header closeButton>
            <Modal.Title>Start Cause 1</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={causeState && causeState.name ? causeState.name : ''}
                onChange={handleCauseChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>About</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="About"
                name="about"
                value={causeState && causeState.about ? causeState.about : ''}
                onChange={handleCauseChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Goal</Form.Label>
              <Form.Control
                type="number"
                placeholder="Goal"
                name="goal"
                value={causeState && causeState.goal ? causeState.goal : 0}
                onChange={handleCauseChange}
                required
              />
            </Form.Group>
            <ToggleButtonGroup name='time'>
              <ToggleButton onClick={() => handleCauseTime(2)} active={active1}>
                2 Weeks
              </ToggleButton>
              <ToggleButton onClick={() => handleCauseTime(4)} active={active2}>
                4 Weeks
              </ToggleButton>
            </ToggleButtonGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleCauseStart} disabled={invalid}>
              Start
            </Button>
            <Button variant="secondary" onClick={handleCauseStop}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>

      <Form  autoComplete="off">
        <Modal show={showUpdate} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Cause 1</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={causeState && causeState.name ? causeState.name : ''}
                onChange={handleCauseChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="About"
                name="about"
                value={causeState && causeState.about ? causeState.about : ''}
                onChange={handleCauseChange}
              />
              </Form.Group>
            <Form.Group>
              <Form.Label>Goal</Form.Label>
              <Form.Control
                type="number"
                placeholder="Goal"
                name="goal"
                value={causeState && causeState.goal ? causeState.goal : 0}
                onChange={handleCauseChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Funds</Form.Label>
              <Form.Control
                type="number"
                placeholder="Funds"
                name="funds"
                value={causeState && causeState.funds ? causeState.funds : 0}
                onChange={handleCauseChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={handleShowStop}>
              Stop
            </Button>
            <Button variant='primary' onClick={handleCauseUpdate}>
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
            <Modal.Title>Stop Cause 1</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to stop this cause?</h4>
            {causeState && causeState.funds > 0 ? <h5>Highest active bids will win!</h5> : <h5>There are no active bids so you can safely continue.</h5>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleCauseStop}>
              Stop
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
      
      <h3>Cause 1</h3>
      <Container>
          {id ?
            <Stack direction='horizontal'>
              <CauseIconForm causeState={causeState} handleGetCauseData={handleGetCauseData} />
              {causeState && causeState.about ? <strong>{causeState.about}</strong> : <strong>About Cause</strong>}
            </Stack>
          : null}
          
          {id ?
            <Stack>
              {causeState && causeState.name ? <h5>{causeState.name}</h5> : <h5>Cause Name</h5>}
              <strong>${causeState && causeState.funds} / ${causeState && causeState.goal}</strong>
            </Stack>
          : null}


          {causeState && causeState.time ?
            <Stack direction='horizontal'>
              <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
              <strong id='timerCenter'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
              <strong id='timerCenter'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
              <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
              <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
            </Stack>
          : <strong>Not Active</strong> }
        </Container>

      {id ?
        <Button id='auctionEditButton' onClick={() => setShowUpdate(true)}>Update</Button>
      : <Button id='auctionEditButton' onClick={handleCauseCreate}>Create</Button> }
    </Container>        
  );   
}