import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import causeService from '../utils/causeService';
import userService from '../utils/userService';
import auctionService from '../utils/auctionService';
import SearchResults from '../components/Displays/SearchDisplay';
import CauseFeed from '../components/Feeds/CauseFeed';
import ArtistFeed from '../components/Feeds/ArtistFeed';
import AuctionFeed from '../components/Feeds/AuctionFeed';
import { Container, Stack, Carousel } from 'react-bootstrap';
import '../styles/Content.css';

export default function Content({ results, searchError, sendGetUser, handleGetBids }){
  const [causes, setCauses] = useState();
  const [artists, setArtists] = useState();
  const [auctions1, setAuctions1] = useState();
  const [auctions2, setAuctions2] = useState();
  const [auctions3, setAuctions3] = useState();
  const [auctions4, setAuctions4] = useState();
  const [auctions5, setAuctions5] = useState();
  const [auctions6, setAuctions6] = useState();
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  async function handleGetCauses(){
    try {
      const data = await causeService.getAll();
      for (let i = data.length-1; i >= 0; i--) {
        if (!data[i].start) {
          data.splice(i, 1);
        }
      }
      setCauses(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetArtists(){
    try {
      const data = await userService.getAll();
      setArtists(data);
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetAuctions(){
    try {
      const data = await auctionService.getAll();
      let auctionData1 = [];
      let auctionData2 = [];
      let auctionData3 = [];
      let auctionData4 = [];
      let auctionData5 = [];
      let auctionData6 = [];
      let count = 1;
      data.forEach(function(auction){
        if (!auction.cause) {
          if (count >= 1 && count <= 4) {
            auctionData1.push(auction);
          };
          if (count >= 5 && count <= 8) {
            auctionData2.push(auction);
          };
          if (count >= 9 && count <= 12) {
            auctionData3.push(auction);
          };
          if (count >= 13 && count <= 16) {
            auctionData4.push(auction);
          };
          if (count >= 17 && count <= 20) {
            auctionData5.push(auction);
          };
          if (count >= 21 && count <= 24) {
            auctionData6.push(auction);
          };
          count += 1;
        }
      })
      setAuctions1(auctionData1);
      setAuctions2(auctionData2);
      setAuctions3(auctionData3);
      setAuctions4(auctionData4);
      setAuctions5(auctionData5);
      setAuctions6(auctionData6);
    } catch (err) {
      console.log(err.message);
    };
  };

  function refresh() {
    handleGetCauses();
    handleGetArtists();
    handleGetAuctions();
  }

  useEffect(() => {
    handleGetCauses();
    handleGetArtists();
    handleGetAuctions();
    const interval = setInterval(() => refresh(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  return (
    <Container id="content">
      <Stack>
        <SearchResults results={results} searchError={searchError} sendGetUser={sendGetUser} />
        <CauseFeed causes={causes} />
        <ArtistFeed artists={artists} />
        <Container id='feed'>
          <Stack>
            <Stack direction="horizontal">
              <h5 id='h5'>Auctions</h5>
              <Link id='link' to={'/auctions'}><h5>View All</h5></Link>
            </Stack>
            <Carousel activeIndex={index} onSelect={handleSelect} interval={null} wrap={false} >
              <Carousel.Item>
                <AuctionFeed auctions={auctions1} handleGetBids={handleGetBids}/>
                <AuctionFeed auctions={auctions2} handleGetBids={handleGetBids}/>
              </Carousel.Item>
              <Carousel.Item>
                <AuctionFeed auctions={auctions3} handleGetBids={handleGetBids}/>
                <AuctionFeed auctions={auctions4} handleGetBids={handleGetBids}/>
              </Carousel.Item>
              <Carousel.Item>
                <AuctionFeed auctions={auctions5} handleGetBids={handleGetBids}/>
                <AuctionFeed auctions={auctions6} handleGetBids={handleGetBids}/>
              </Carousel.Item>
            </Carousel>
          </Stack>
        </Container>

      </Stack>
    </Container>
  )
}