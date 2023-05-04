import React, { useState, useEffect} from 'react';

import { Card, Container, Stack, Image, Button } from 'react-bootstrap'
import auctionService from '../../utils/auctionService';
import bidService from '../../utils/bidService';
import causeService from '../../utils/causeService';


export default function BidDisplayCard({ bid, idx, handleGetBids }) {
  const [disabled, setDisabled] = useState(true);
  const [cause, setCause] = useState();
  const [auction, setAuction] = useState();

  async function handleGetCauseData() {
    try {
      const data = await causeService.getOne({id: bid.cause});
      setCause(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetAuctionData() {
    try {
      const data = await auctionService.getOne({id: bid.auction});
      // 43200 sec = 12 hours for time to be able to cancel bid
      // 604800 sec = 1 week
      if ((data.start + (604800 * data.time) - (Date.now() / 1000)) >= 43200) {
        setDisabled(false)
      }
      setAuction(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleCancelBid() {
    try {
      await bidService.update({id: bid.id, status: 'CANCELLED'});
      handleGetBids();
    } catch (err) {
      console.log(err.message);
    };
  };

  useEffect(() => {
    handleGetCauseData();
    handleGetAuctionData();
  }, []);

  return (
    <Container id='causeDisplayCont'>
      <Card id='causeDisplayCard' key={ idx }>
        <Card.Body>
          <Stack>
            <Stack direction='horizontal'>
              <Image src={ auction && auction.image1 ? auction.image1 : '/icons/image.svg' } alt='' id='cartImage' />
              <Stack>
                <strong>Auction: { auction && auction.name ? auction.name : bid.auction }</strong>
                <strong>Cause: { cause && cause.name ? cause.name : 'None' }</strong>
                <strong>Amount: ${ bid.amount }.00</strong>
                <strong>{bid.status}</strong>
              </Stack>
            </Stack>
            <Button variant='danger' disabled={disabled} onClick={handleCancelBid}>Cancel</Button>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}