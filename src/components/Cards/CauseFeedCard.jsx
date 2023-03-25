import React, { useState, useEffect} from 'react';
import auctionService from '../../utils/auctionService';

import { Card, Container, Stack, Image, ProgressBar, Carousel } from 'react-bootstrap'


export default function CauseFeedCard({ cause, idx}) { 
  const [auctions1, setAuctions1] = useState([]);
  const [auctions2, setAuctions2] = useState([]);
  const [auctions3, setAuctions3] = useState([]);
  
  const [time, setTime] = useState(Date.now());
  const total = (cause.start + (604800 * cause.time)) - (time / 1000);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  
  async function handleGetAuctions() {
    try {
      const data = await auctionService.getCause({id: cause.id});
      let auctionData1 = [];
      let auctionData2 = [];
      let auctionData3 = [];
      let count = 1;
      data.sort(function(a,b){return a.start - b.start});
      data.sort(function(a,b){return b.funds - a.funds});
      data.forEach(function(auction){
        if (count >= 1 && count <= 8) {
          auctionData1.push(auction);
        };
        if (count >= 9 && count <= 16) {
          auctionData2.push(auction);
        };
        if (count >= 17 && count <= 25) {
          auctionData3.push(auction);
        };
        count += 1;
      })
      setAuctions1(auctionData1);
      setAuctions2(auctionData2);
      setAuctions3(auctionData3);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    handleGetAuctions();
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container id='causeFeedCont'>
      <Card id='causeFeedCard' key={idx}>
        <Card.Body>
          <Stack>
            <Stack direction='horizontal'>
              {cause.icon ? <Image src={ cause.icon } alt='' id='causeIcon' /> : <Image src={ '/icons/image.svg' } alt='' id='causeIcon' />}
              <Stack style={{width: '19rem'}}>
                <strong>{cause.name}</strong>
                <strong>${cause.funds} / ${cause.goal}</strong>
                <Stack direction='horizontal'>
                  <strong id='timerLeft'>{ Math.floor(total / 60 / 60 / 24 / 7) } W</strong>
                  <strong id='timerCenter'>{ Math.floor(total / 60 / 60 / 24 % 7) } D</strong>
                  <strong id='timerCenter'>{ Math.floor(total / 60 / 60 % 24) } H</strong>
                  <strong id='timerCenter'>{ Math.floor(total / 60 % 60) } M</strong>
                  <strong id='timerRight'>{ Math.floor(total % 60) } S</strong>
                </Stack>
              </Stack>
              <ProgressBar now={cause.funds / cause.goal * 100} />
            </Stack>
            <Carousel activeIndex={index} onSelect={handleSelect} interval={null} wrap={false} >
              <Carousel.Item>
                {!auctions1 || typeof auctions1 == 'undefined' ? <h2>No Data</h2> : !Array.isArray(auctions1) ? <h2>Results are not Array</h2> :
                  auctions1.map((auction, idx) => {
                      return (
                        
                          <Image key={idx} src={ auction.image1 } alt='' id='causeIcon' />
                        
                      )
                  })
                }
              </Carousel.Item>
              <Carousel.Item>
                {!auctions2 || typeof auctions2 == 'undefined' ? <h2>No Data</h2> : !Array.isArray(auctions2) ? <h2>Results are not Array</h2> :
                  auctions2.map((auction, idx) => {
                      return (
                        
                          <Image key={idx} src={ auction.image1 } alt='' id='causeIcon' />
                        
                      )
                  })
                }
              </Carousel.Item>
              <Carousel.Item>
                {!auctions3 || typeof auctions3 == 'undefined' ? <h2>No Data</h2> : !Array.isArray(auctions3) ? <h2>Results are not Array</h2> :
                  auctions3.map((auction, idx) => {
                      return (
                        
                          <Image key={idx} src={ auction.image1 } alt='' id='causeIcon' />
                        
                      )
                  })
                }
              </Carousel.Item>
            </Carousel>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}