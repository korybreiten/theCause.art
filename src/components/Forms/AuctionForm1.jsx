import React, { useState, useEffect } from 'react';
import ErrorMessage from '../System/ErrorMessage';
import userService from '../../utils/userService';
import causeService from '../../utils/causeService';
import auctionService from '../../utils/auctionService';
import AuctionImageForm1 from './AuctionImageForm1';
import AuctionImageForm2 from './AuctionImageForm2';
import AuctionImageForm3 from './AuctionImageForm3';
import CauseFeedCard from '../Cards/CauseFeedCard';

import { Button, Form, Container, Stack, Modal, Image, ToggleButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';


export default function AuctionForm1({ profileData, handleGetProfile }){
  let id = profileData.auction1;
  const [invalid, setInvalid] = useState(true);
  const [causes, setCauses] = useState([]);
  const [cause, setCause] = useState();
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
    image3: '',
    cause: 0
  });

  let start = 0;
  let duration = 0;
  if (auctionState) {
    start = auctionState.start;
    duration = auctionState.time;
  };

  if (auctionState && auctionState.cause && !cause){
    handleGetCauseData();
  };

  const [doOnce, setDoOnce] = useState(true);
  if (doOnce && auctionState && auctionState.name && auctionState.width && auctionState.height && auctionState.depth && auctionState.time){
    setDoOnce(false);
    setInvalid(false);
  };

  const [time, setTime] = useState(Date.now());
  const total = (start + (604800 * duration)) - (time / 1000);

  const [showUpdate, setShowUpdate] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [showWarnStart, setShowWarnStart] = useState(false);
  const [showWarnUpdate, setShowWarnUpdate] = useState(false);

  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);


  function handleClose(){
    setShowUpdate(false);
    setShowStart(false);
    setShowStop(false);
    setShowWarnStart(false);
    setShowWarnUpdate(false);
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
      const formData = { auction1: auctionId, id: profileData.id };
      await userService.update(formData);
      handleGetProfile();
      handleGetAuctionData();
      handleGetCauseData();
      setShowStart(true);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleAuctionStart(donate){
    try {
      let startDate = 0;
      let timeDuration = 0;
      if (donate){
        startDate = cause.start;
        timeDuration = cause.time;
      } else {
        startDate = Math.floor(Date.now() / 1000);
        timeDuration = auctionState.time;
      };
      const formData = {
        id: id,
        name: auctionState.name,
        width: auctionState.width,
        height: auctionState.height,
        depth: auctionState.depth,
        start: startDate,
        time: timeDuration,
        funds: auctionState.funds,
        cause: auctionState.cause
      }
      await auctionService.update(formData);
      handleGetProfile();
      handleGetAuctionData();
      handleGetCauseData();
      handleClose();
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleAuctionUpdate(donate){
    try {
      let formData = {};
      if (id > 0 && donate) {
        formData = {
          id: id,
          name: auctionState.name,
          width: auctionState.width,
          height: auctionState.height,
          depth: auctionState.depth,
          funds: auctionState.funds,
          cause: auctionState.cause,
          start: cause.start,
          time: cause.time
        };
      } else if (id > 0 && !donate) {
        formData = {
          id: id,
          name: auctionState.name,
          width: auctionState.width,
          height: auctionState.height,
          depth: auctionState.depth,
          funds: auctionState.funds
        };
      };
      await auctionService.update(formData);
      handleGetProfile();
      handleGetAuctionData();
      handleGetCauseData();
      handleClose();
    } catch (err) {
      console.log(err.message);
    };
  };

  function handleShowStop(){
    handleClose();
    setShowStop(true);
  }

  function handleShowWarnStart(){
    if (auctionState && auctionState.cause > 0) {
      handleClose();
      setShowWarnStart(true);
    } else {
      handleAuctionStart(false);
    };
  };

  function handleShowWarnUpdate(){
    if (auctionState && auctionState.cause > 0) {
      handleClose();
      setShowWarnUpdate(true);
    } else {
      handleAuctionUpdate(false);
    };
  };

  async function handleAuctionStop(){
    try {
      if (id > 0){
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
        image3: '',
        cause: 0
      });

      await auctionService.remove(id);
      const formData = { auction1: 0, id: profileData.id };
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
      handleGetCauseData();
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetCauses(){
    try {
      const data = await causeService.getAll();
      setCauses(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetCauseData(){
    try {
      if (auctionState && auctionState.cause){
        const data = await causeService.getOne(auctionState.cause);
        setCause(data);
      };
    } catch (err) {
      console.log(err.message);
    };
  };

  function handleSetCause(cause){
    setAuctionState({
      ...auctionState,
      cause: cause
    });
    handleGetCauseData();
  };

  function handleClearCause(){
    setAuctionState({
      ...auctionState,
      cause: 0
    });
    setCause();
  };

  useEffect(() => {
    handleGetAuctionData();
    handleGetCauseData();
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
    
  return (
    <Container>
      
      <Form  autoComplete="off">
        <Modal show={showStart} onHide={handleAuctionStop}>
          <Modal.Header closeButton>
            <Modal.Title>Start Auction 1</Modal.Title>
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
            <br />
            <strong>{cause && cause.name ? 'Cause: ' + cause.name : 'Cause: None'}</strong>
            <Dropdown onClick={handleGetCauses}>
              <Dropdown.Toggle>
                Donate to a Cause
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {!causes || typeof causes == 'undefined' ? <h2>No Data</h2> : !Array.isArray(causes) ? <h2>Results are not Array</h2> :
                  causes.map((cause, idx) => {
                      return (
                        <Dropdown.Item key={idx} onClick={() => handleSetCause(cause.id)}><CauseFeedCard cause={cause} key={idx}/></Dropdown.Item>
                      )
                  })
                }
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="danger" onClick={handleClearCause}>
              Clear
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleShowWarnStart} disabled={invalid}>
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
            <Modal.Title>Update Auction 1</Modal.Title>
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
            <br />
            {auctionState && !auctionState.cause ?
              <Container>
                <strong>Donated to: {cause && cause.name ? cause.name : 'None'}</strong>
                <Dropdown onClick={handleGetCauses}>
                  <Dropdown.Toggle>
                    Donate to a Cause
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {!causes || typeof causes == 'undefined' ? <h2>No Data</h2> : !Array.isArray(causes) ? <h2>Results are not Array</h2> :
                      causes.map((cause, idx) => {
                          return (
                            <Dropdown.Item key={idx} onClick={() => handleSetCause(cause.id)}><CauseFeedCard cause={cause} key={idx}/></Dropdown.Item>
                          )
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown>
              </Container>
              :
              <strong>Donated to: {cause && cause.name ? cause.name : 'None'}</strong>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={handleShowStop}>
              Stop
            </Button>
            <Button variant='primary' onClick={handleShowWarnUpdate}>
              Update
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>

      <Modal show={showStop} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Stop Auction 1</Modal.Title>
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

      <Modal show={showWarnStart} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning: Time Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Donating to a Cause will set the time remaining to match the Cause it is donated to.</h4>
          <h4>This process can't be undone. Would you still like to proceed?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => handleAuctionStart(true)}>
            Donate
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWarnUpdate} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning: Time Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Donating to a Cause will set the time remaining to match the Cause it is donated to.</h4>
          <h4>Would you still like to proceed?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => handleAuctionUpdate(true)}>
            Donate
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      
      <h3>Auction 1</h3>
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
          <strong>{cause && cause.name ? 'Cause: ' + cause.name : 'Cause: None'}</strong>
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

      {id ?
        <Button id='auctionEditButton' onClick={() => setShowUpdate(true)}>Update</Button>
      : <Button id='auctionEditButton' onClick={handleAuctionCreate}>Create</Button> }

    </Container>        
  );   
}