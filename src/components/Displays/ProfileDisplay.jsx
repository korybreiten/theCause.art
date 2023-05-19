import React from 'react';
import {Link} from 'react-router-dom';
import ProfileAvatarForm from '../Forms/ProfileAvatarForm';
import ProfileEmailForm from '../Forms/ProfileEmailForm';
import ProfilePaypalEmailForm from '../Forms/ProfilePaypalEmailForm';
import ProfilePaypalClientIdForm from '../Forms/ProfilePaypalClientIdForm';
import ProfileBioForm from '../Forms/ProfileBioForm';
import AuctionForm1 from '../Forms/AuctionForm1';
import AuctionForm2 from '../Forms/AuctionForm2';
import AuctionForm3 from '../Forms/AuctionForm3';
import CauseForm1 from '../Forms/CauseForm1';
import CauseForm2 from '../Forms/CauseForm2';
import CauseForm3 from '../Forms/CauseForm3';

import { Container, Stack } from 'react-bootstrap';


export default function ProfileDisplay({ profileData, handleGetProfile }) {
  return (
    <Container id='profileDisplayCont'>
      <Stack direction='horizontal'>
        <Stack id='profileDisplayStack1Left'>
          <ProfileAvatarForm profileData={profileData} handleGetProfile={handleGetProfile} />
            { profileData ? <h3>Username</h3> : <h3>Sign in to see profile</h3> }
            { profileData ? <h5>{profileData.username}</h5> : null }
            { profileData ? <Link id='link' to={'/profile/' + profileData.username}>View Public Profile</Link> : null }
        </Stack>
        <Stack id='profileDisplayStack1Right'>
          <Stack>
            <Stack id='editBioCont'>
              <Stack direction='horizontal'>
                { profileData ? <h3 id='label' style={{width: '-webkit-fill-available'}}>Email (Notifications)</h3> : null }
                { profileData ?
                  <ProfileEmailForm profileData={profileData} handleGetProfile={handleGetProfile} />
                : null }
              </Stack>
              { profileData ? <h5>{profileData.email}</h5> : null }
            </Stack>
            <Stack id='editBioCont'>
              <Stack direction='horizontal'>
                { profileData ? <h3 id='label' style={{width: '-webkit-fill-available'}}>Paypal Email (Buyer)</h3> : null }
                { profileData ?
                  <ProfilePaypalEmailForm profileData={profileData} handleGetProfile={handleGetProfile} />
                : null }
              </Stack>
              { profileData ? <h5>{profileData.paypalEmail}</h5> : null }
            </Stack>
            <Stack id='editBioCont'>
              <Stack direction='horizontal'>
                { profileData ? <h3 id='label' style={{width: '-webkit-fill-available'}}>Paypal Client Id (Seller)</h3> : null }
                { profileData ?
                  <ProfilePaypalClientIdForm profileData={profileData} handleGetProfile={handleGetProfile} />
                : null }
              </Stack>
              { profileData ? <h5>{profileData.clientId}</h5> : null }
            </Stack>
            <Stack id='editBioCont'>
              <Stack direction='horizontal'>
                { profileData ? <h3 id='label' style={{width: '-webkit-fill-available'}}>Biography</h3> : null }
                { profileData ?
                  <ProfileBioForm profileData={profileData} handleGetProfile={handleGetProfile} />
                : null }
              </Stack>
              { profileData ? <h5 id='bio'>{profileData.bio}</h5> : null }
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      { profileData && profileData.clientId ?
        <Container>
          <Stack direction='horizontal' id='profileDisplayStack2'>
            <CauseForm1 profileData={profileData} handleGetProfile={handleGetProfile} />
            <CauseForm2 profileData={profileData} handleGetProfile={handleGetProfile} />
            <CauseForm3 profileData={profileData} handleGetProfile={handleGetProfile} />
          </Stack>
          <Stack direction='horizontal' id='profileDisplayStack2'>
            <AuctionForm1 profileData={profileData} handleGetProfile={handleGetProfile} />
            <AuctionForm2 profileData={profileData} handleGetProfile={handleGetProfile} />
            <AuctionForm3 profileData={profileData} handleGetProfile={handleGetProfile} />
          </Stack>
        </Container>
      :
      <Container style={{textAlign: 'center'}}>
        <h2 style={{color: 'salmon'}}>In order to create Causes or Auctions</h2>
        <h2 style={{color: 'salmon'}}>Please add your Client Id from the PayPal Developer portal </h2>
        <a style={{fontSize: '2rem'}} id='link' href='https://developer.paypal.com' target='_blank'>https://developer.paypal.com</a>
      </Container>
      }
    </Container>
  );
}
