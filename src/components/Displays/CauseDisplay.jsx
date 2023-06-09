import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../../utils/userService';

import { Container, Image, Stack } from 'react-bootstrap';


export default function CauseDisplay() {
    const params = useParams();
    const [userData, setUserData] = useState();

    async function handleGetUser(){
        try {
        const user = await userService.getUsername(params);
        setUserData(user);
        } catch (err) {
        console.log(err.message);
        };
    };

    useEffect(() => {
        handleGetUser();
    }, [])

    return (
        <Container>
        <Stack direction='horizontal'>
            <Stack>
            { userData && userData.avatar ? <Image src={ userData.avatar } alt='' id='avatarProfile' /> : <i id="avatarProfileDefault" className="bi bi-person-square" /> }
            { userData ? <h3>{userData.username}</h3> : <h3>User Not Found</h3> }
            </Stack>
            { userData ? <h4>{userData.bio}</h4> : null }
        </Stack>
        </Container>

    );
}
