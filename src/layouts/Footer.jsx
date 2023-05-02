import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Container, Stack } from 'react-bootstrap';
import '../styles/Footer.css';

export default function Footer(){

    return (
        <Container id='footerCont'>
            <Stack direction="horizontal">
                <Image id='footerLogoIcon' src='/icons/favicon.ico' />
                <Link id="footerLogo" to={'/'}>theCause.art</Link>
            </Stack>
        </Container>
    )
}