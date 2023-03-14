import React, { useState, useEffect} from 'react';
import auctionService from '../../utils/auctionService';

import { Card, Container, Stack, Image } from 'react-bootstrap'


export default function ArtistFeedCard({ artist, idx }) { 
  const [auction1, setAuction1] = useState('');
  const [auction2, setAuction2] = useState('');
  const [auction3, setAuction3] = useState('');

  async function handleGetAuctionData(){
    try {
      const formData1 = {id: artist.auction1};
      const data1 = await auctionService.getOne(formData1);
      if (data1 && data1.start) {
        setAuction1(data1.image1);
      }
      const formData2 = {id: artist.auction2};
      const data2 = await auctionService.getOne(formData2);
      if (data2 && data2.start) {
        setAuction2(data2.image1);
      }
      const formData3 = {id: artist.auction3};
      const data3 = await auctionService.getOne(formData3);
      if (data3 && data3.start) {
        setAuction3(data3.image1);
      }
    } catch (err) {
      console.log(err.message)
    };
  };

  useEffect(() => {
    handleGetAuctionData();
  }, []);

  return (
    <Container id='artistFeedCont'>
      <Card id='artistFeedCard' key={idx}>
        <Card.Body>
          <Stack>
            {artist.avatar ? <Image src={ artist.avatar } alt='' id='artistFeedAvatar' /> : <Image src={ '/icons/profile.svg' } alt='' id='artistFeedAvatar' />}
            <strong>{ artist.username }</strong>
            {auction1 ? <Image src={ auction1 } alt='' id='artistFeedAuction' /> : <Image src={ '/icons/image.svg' } alt='' id='artistFeedAuction' />}
            {auction2 ? <Image src={ auction2 } alt='' id='artistFeedAuction' /> : <Image src={ '/icons/image.svg' } alt='' id='artistFeedAuction' />}
            {auction3 ? <Image src={ auction3 } alt='' id='artistFeedAuction' /> : <Image src={ '/icons/image.svg' } alt='' id='artistFeedAuction' />}
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}