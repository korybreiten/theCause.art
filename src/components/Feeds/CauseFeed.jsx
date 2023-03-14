import React from 'react';
import {Link} from 'react-router-dom';
import CauseFeedCard from '../Cards/CauseFeedCard';



import { Container, Accordion, Image, Button, Stack } from 'react-bootstrap';


export default function CauseFeed({ causes }) {
    return (
        <Container id='feed'>
            <Stack direction="horizontal">
                <h5 id='h5'>Causes</h5>
                <Link id='link' to={'/causes'}><h5>View All</h5></Link>
            </Stack>
            
            <Stack>
                {!causes || typeof causes == 'undefined' ? <h2>No Data</h2> : !Array.isArray(causes) ? <h2>Results are not Array</h2> :
                    causes.map((cause, idx) => {
                        return (
                            <CauseFeedCard cause={cause} key={idx} />
                        )
                    })
                }
            </Stack>
        </Container>

    );
}