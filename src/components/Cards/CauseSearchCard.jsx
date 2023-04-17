import React, { useState, useEffect} from 'react';
import bidService from '../../utils/bidService';
import userService from '../../utils/userService';

import { Card, Container, Stack, Image, Button, Form } from 'react-bootstrap'


export default function AuctionFeedCard({ auction, idx, handleGetBids }) { 
  const [time, setTime] = useState(Date.now());
  const total = (auction.start + (2500 * auction.time)) - (time / 1000);

  const user = userService.getToken();
  let creator = '';
  if (user) {
    creator = user.username;
  }

  const [amount, setAmount] = useState(0);

  function handleAmountChange(e){
    setAmount(e.target.value);
  };

  async function handlePlaceBid() {
    try {
      const formData = {creator: creator, auction: auction.id, amount: amount}
      bidService.create(formData);
      handleGetBids();
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container id='auctionFeedCont'>
      <Card id='auctionFeedCard' key={idx}>
        <Card.Body>            
          <Stack id='auctionFeedTop'>
            {auction.image1 ? <Image src={ auction.image1 } alt='' id='auctionMainFeed' /> : <Image src={ '/icons/image.svg' } alt='' id='auctionMainFeed' /> }
            <strong>{auction.name}</strong>
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
            <Form>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Bid Amount"
                  name="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
              </Form.Group>
            </Form>
            <Button onClick={handlePlaceBid}>Place Bid</Button>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}