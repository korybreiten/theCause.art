import React, { useState, useEffect} from 'react';
import bidService from '../../utils/bidService';
import userService from '../../utils/userService';

import { Card, Container, Stack, Image, Button, Form, Modal } from 'react-bootstrap'
import auctionService from '../../utils/auctionService';


export default function AuctionFeedCard({ auction, idx, handleGetBids }) { 
  const [showAuction, setShowAuction] = useState(false);
  const [time, setTime] = useState(Date.now());
  const total = (auction.start + (604800 * auction.time)) - (time / 1000); // 604800 = 1 Week

  const [minimum, setMinimum] = useState(auction.funds + 1);
  const [amount, setAmount] = useState(auction.funds + 1);

  function handleClose() {
    setShowAuction(false);
  };

  function handleAmountChange(e){
    setAmount(e.target.value);
  };

  async function handlePlaceBid() {
    try {
      let formData = {};
      const token = userService.getToken();
      const user = await userService.getUsername({username: token.username});
      if (auction.cause) {
        formData = {creator: user.id, auction: auction.id, amount: amount, cause: auction.cause}
      } else {
        formData = {creator: user.id, auction: auction.id, amount: amount, cause: 0}
      };
      if (auction.bid) {
        await bidService.update({id: auction.bid, status: 'OUTBID'});
        console.log('HELLOOOOOO')
      }
      const bidId = await bidService.create(formData);
      await auctionService.update({id: auction.id, bid: bidId, funds: amount});
      handleGetBids();
      handleClose();
    } catch (err) {
      console.log(err.message)
    }
  }

  function showModal(){
    setShowAuction(true);
    setFunds();
  }

  function setFunds() {
    setMinimum(auction.funds + 1);
    setAmount(auction.funds + 1);
  }

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container id='auctionFeedCont'>
      <Card id='auctionFeedCard' key={idx} onClick={showModal}>
        <Card.Body>            
          <Stack id='auctionFeedTop'>
            {auction.image1 ? <Image src={ auction.image1 } alt='' id='auctionMainFeed' /> : <Image src={ '/icons/image.svg' } alt='' id='auctionMainFeed' /> }
            <strong>{auction.name}</strong>
            <strong>{auction.bid ? auction.bid : 'No Bids'}</strong>
          </Stack>
          <Stack>
            <strong>${auction.funds}</strong>
            <Stack direction='horizontal'>
              <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
              <strong id='timerRight'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
            </Stack>
            <Stack direction='horizontal'>
              <strong id='timerLeft'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
              <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
              <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
            </Stack>
            <strong>{auction.status}</strong>
          </Stack>
        </Card.Body>
      </Card>

      <Modal show={showAuction} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{ auction.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack direction='horizontal'>
            {auction.image1 ? <Image src={ auction.image1 } alt='' id='auctionMainFeed' /> : <Image src={ '/icons/image.svg' } alt='' id='auctionMainFeed' /> }
            <Stack>
              <strong>${auction.funds}</strong>
              <Stack direction='horizontal'>
                <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
                <strong id='timerRight'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
                <strong id='timerLeft'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
                <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
                <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
              </Stack>
              <Form>
                <Form.Group>
                  <Form.Control
                    type="number"
                    placeholder="Bid Amount"
                    name="amount"
                    min={minimum}
                    value={amount}
                    onChange={handleAmountChange}
                    required
                  />
                </Form.Group>
              </Form>
              <Button onClick={handlePlaceBid}>Place Bid</Button>
              <strong>{auction.status}</strong>
            </Stack>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}