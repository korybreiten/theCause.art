import React, { useState, useEffect} from 'react';
import bidService from '../../utils/bidService';
import userService from '../../utils/userService';

import { Card, Container, Stack, Image, Button, Form } from 'react-bootstrap'


export default function AuctionFeedCard({ auction, idx, handleGetBids }) { 
  const [time, setTime] = useState(Date.now());
  const total = (auction.start + (10000 * auction.time)) - (time / 1000); // 604800 = 1 Week

  const [amount, setAmount] = useState(0);

  function handleAmountChange(e){
    setAmount(e.target.value);
  };

  async function handlePlaceBid() {
    try {
      let formData1 = {};
      let creator = 0;
      const token = userService.getToken();
      const formData2 = {username: token.username};
      const user = await userService.getUsername(formData2);
      creator = user.id;
      if (auction.cause) {
        formData1 = {creator: creator, auction: auction.id, amount: amount, cause: auction.cause}
      } else {
        formData1 = {creator: creator, auction: auction.id, amount: amount, cause: 0}
      };
      bidService.create(formData1);
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
            <strong>{auction.status}</strong>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}