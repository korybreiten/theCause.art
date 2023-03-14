import React, { useState, useEffect} from 'react';

import { Card, Container, Stack, Image, Button } from 'react-bootstrap'
import auctionService from '../../utils/auctionService';
import bidService from '../../utils/bidService';
import causeService from '../../utils/causeService';


export default function BidDisplayCard({ bid, idx, handleGetBids, setAuctionId }) {
  const [cause, setCause] = useState();
  const [auction, setAuction] = useState();

  async function handleGetCauseData() {
    try {
      const formData = {id: bid.cause}
      const data = await causeService.getOne(formData);
      setCause(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetAuctionData() {
    try {
      const formData = {id: bid.auction}
      const data = await auctionService.getOne(formData);
      setAuction(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleRemoveBid(){
    try {
      const formData = {id: bid.id}
      await bidService.remove(formData);
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
                <strong>Auction: { auction && auction.name ? auction.name : 'Error' }</strong>
                <strong>Cause: { cause && cause.name ? cause.name : 'None' }</strong>
                <strong>Amount: ${ bid.amount }.00</strong>
              </Stack>
            </Stack>
            <Button variant='danger' onClick={handleRemoveBid}>Remove</Button>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}