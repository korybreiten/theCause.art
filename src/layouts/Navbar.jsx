import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm';
import JoinForm from '../components/Forms/JoinForm';
import CartDisplay from '../components/Displays/CartDisplay';

import { Image, Button, Form, Container, Stack } from 'react-bootstrap';
import '../styles/Navbar.css';

export default function Navbar({ profileData, handleJoin, handleLogin, handleLogout, handleSearch, handleClearSearch, handleGetBids, bids, subtotal, fees, total }){
    const [active, setActive] = useState('');
    const [searchState, setSearchState]  = useState({keyword: ''});
    const navigate = useNavigate();

    function handleSearchChange(e){
        setSearchState({
            ...searchState,
            [e.target.name]: e.target.value
        });
    };

    function sendSearch(e){
        e.preventDefault();
        handleSearch(searchState);
        navigate('/');
    };

    function sendClearSearch(){
        setSearchState({keyword: ''});
        handleClearSearch();
    };

    return (
        <Container id='navCont'>
            <Container id="navHeader">
                <Stack direction="horizontal">
                    <Link id="logo" to={'/'} onClick={() => setActive('')}>theCause.art</Link>
                    {!profileData ? <JoinForm handleJoin={handleJoin} /> : <Container className='ms-auto' /> }
                    {!profileData ? <LoginForm handleLogin={handleLogin} /> : <Link id="link" to={'/'} onClick={ handleLogout }>Logout</Link> }
                    {!profileData ?
                        null
                    : !profileData.avatar ?
                        <Link id="link" to={'/profile'}><Image src={ '/icons/profile.svg' } alt='' id='avatar' /></Link>
                    :
                        <Link id="link" to={'/profile'}><Image src={ profileData.avatar } alt='' id='avatar' /></Link>
                    }
                </Stack>
            </Container>
            <Container id="navLinks">
                <Stack direction="horizontal" style={{height: '2.5rem'}}>
                    <Link id="link" to={'/causes'}>
                        <Button style={{padding: 0, fontSize: '1.5rem'}} onClick={() => setActive('causes')} active={active === 'causes'}>Causes</Button>
                    </Link>
                    <Link id="link" to={'/artists'}>
                        <Button style={{padding: 0, fontSize: '1.5rem'}} onClick={() => setActive('artists')} active={active === 'artists'}>Artists</Button>
                    </Link>
                    <Link id="link" to={'/auctions'}>
                        <Button style={{padding: 0, fontSize: '1.5rem'}} onClick={() => setActive('auctions')} active={active === 'auctions'}>Auctions</Button>
                    </Link>
                    <Container id='searchSpacer' style={{width: '-webkit-fill-available'}}/>
                    <Container id='searchContainer'>
                        <Form autoComplete="off" onSubmit={sendSearch}>
                            <Stack direction="horizontal">
                                <Form.Group>
                                    <Form.Control
                                        id="searchBar"
                                        type="text"
                                        placeholder="Search"
                                        name="keyword"
                                        value={searchState.keyword}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                                { searchState.keyword !== '' ? <Button id='clearSearch' onClick={ sendClearSearch }>X</Button> : <div id='searchBlank' /> }
                            </Stack>
                        </Form>
                    </Container>
                    <CartDisplay profileData={profileData} handleGetBids={handleGetBids} bids={bids} subtotal={subtotal} fees={fees} total={total} />
                </Stack>
            </Container>
        </Container>
    )
}