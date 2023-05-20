import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../../utils/userService';
import CauseDisplayCard from '../Cards/CauseDisplayCard';
import AuctionFeedCard from '../Cards/AuctionFeedCard';
import causeService from '../../utils/causeService';
import auctionService from '../../utils/auctionService';

import { Container, Image, Stack } from 'react-bootstrap';


export default function UserDisplay() {
  const params = useParams();
  const [userData, setUserData] = useState();
  const [causes, setCauses] = useState();
  const [auctions, setAuctions] = useState();

  async function handleGetUser(){
    try {
      const user = await userService.getUsername(params);
      const causes = await causeService.getUser({id: user.id});
      const auctions = await auctionService.getUser({id: user.id});
      setUserData(user);
      setCauses(causes);
      setAuctions(auctions);
    } catch (err) {
      console.log(err.message);
    };
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <Container id='profileDisplayCont'>
      <Stack direction='horizontal'>
        <Stack id='profileDisplayStack1Left'>
          { userData && userData.avatar ? <Image src={ '../' + userData.avatar } alt='' style={{width: '10rem', height: '10rem', border: '0.5rem solid #989898', borderRadius: '1rem', objectFit: 'cover'}} /> : <i style={{width: '10rem', height: '15rem', marginTop: '-5rem', fontSize: '10rem', color: '#989898'}} className="bi bi-person-square" /> }
          { userData ? <h3>{userData.username}</h3> : <h3>User Not Found</h3> }
          <h3>CP: 100000</h3>
          <h3>Sold: 14000</h3>
          <h3>Joined: October 2023</h3>
        </Stack>
        <Stack id='profileDisplayStack1Right'>
          { userData ? <h4>{userData.bio}</h4> : null }
        </Stack>
      </Stack>
      <Stack>
        <Container>
          {!causes || typeof causes == 'undefined' ? <h2>No Data</h2> : !Array.isArray(causes) ? <h2>Results are not Array</h2> :
            causes.map((cause, idx) => {
              return (
                <CauseDisplayCard cause={cause} key={idx} />
              )
            })
          }
        </Container>
      </Stack>
      <Stack>
        <Container>
          {!auctions || typeof auctions == 'undefined' ? <h2>No Data</h2> : !Array.isArray(auctions) ? <h2>Results are not Array</h2> :
            auctions.map((auction, idx) => {
              return (
                <AuctionFeedCard auction={auction} key={idx} />
              )
            })
          }
        </Container>
      </Stack>
    </Container>

  );
}
