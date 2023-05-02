import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Content from '../layouts/Content';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import ProfileDisplay from '../components/Displays/ProfileDisplay';
import UserDisplay from '../components/Displays/UserDisplay';
import CauseDisplay from '../components/Displays/CauseDisplay';
import searchService from '../utils/searchService';
import userService from '../utils/userService';
import bidService from '../utils/bidService';

import { Container, Stack, ThemeProvider } from 'react-bootstrap';


function App() {
  const [profileData, setProfileData] = useState();
  const [bids, setBids] = useState(handleGetTotal());
  const [total, setTotal] = useState();
  const [subtotal, setSubtotal] = useState();
  const [fees, setFees] = useState();
  
  const [searchError, setSearchError ] = useState('');

  const [results, setResults] = useState([]);



  async function handleJoin(joinState){
    try {
      await userService.join(joinState);
      handleGetProfile();
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleLogin(logState){
    try {
      await userService.login(logState);
      handleGetProfile();
    } catch (err) {
      console.log(err.message);
    };
  };

  async function handleGetProfile(){
    try {
      const user = await userService.getUsername(userService.getToken());
      setProfileData(user);
      handleGetBids();
    } catch (err) {
      console.log(err.message);
    };
  };

  function handleLogout(){
    userService.logout();
    setProfileData();
    setResults([]);
  };

  async function handleSearch(formData) {
    try {
      if (formData.keyword === '') {
        setResults([]);
      } else {
        const data = await searchService.search(formData);
        setResults(data);
      }
    } catch (err) {
      console.log(err.message);
      setSearchError(err.message);
    };
  };

  function handleClearSearch() {
    setResults([]);
  };

  async function handleGetBids(){
    try {
      if (profileData) {
        let bids = []
        const data = await bidService.getUser({id: profileData.id});
        data.forEach(function(bid){
          if (bid.status === 'WINNER') {
            bids.push(bid)
          }
        })
        setBids(bids);
        handleGetTotal();
      }
    } catch (err) {
      console.log(err.message)
    };
  };

  async function handleGetTotal() {
    try {
      let sub = 0;
      let fee = 0;
      let sum = 0;
      let bids = [];
      const data = await bidService.getUser({id: profileData.id});
      data.forEach(function(bid){
        if (bid.status === 'WINNER') {
          bids.push(bid)
        };
      });

      bids.forEach(function(bid) {
        // Check if bid was for a Cause
        // If not add a server fee of $1.00 for each bid
        if (bid.cause > 0) {
          sub += bid.amount;
        } else {
          sub += bid.amount;
          fee += 1;
        };
        
        // Add up the total and assign values as states
        sum = sub + fee;
        setSubtotal(sub);
        setFees(fee);
        setTotal(sum);
      })
    } catch (err) {
      console.log(err.message)
    };
  };

  useEffect(() => {
    handleGetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Router>
        <ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
          <Stack>
            <Navbar profileData={profileData} handleJoin={handleJoin} handleLogin={handleLogin} handleLogout={handleLogout} handleSearch={handleSearch} handleClearSearch={handleClearSearch} handleGetBids={handleGetBids} bids={bids} subtotal={subtotal} fees={fees} total={total} />
            <Routes>
              <Route path="/" element={ <Content results={results} searchError={searchError} handleGetBids={handleGetBids} /> } />
              <Route path="/profile" element={ <ProfileDisplay profileData={profileData} handleGetProfile={handleGetProfile} /> } />
              <Route path="/:username" element={ <UserDisplay /> } />
              <Route path="/causes" element={ <CauseDisplay /> } />
            </Routes>
            <Footer />
          </Stack>
        </ThemeProvider>
      </Router>
    </Container>
  );
};

export default App;