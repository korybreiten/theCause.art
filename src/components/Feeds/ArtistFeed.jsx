import React from 'react';
import {Link} from 'react-router-dom';
import ArtistFeedCard from '../Cards/ArtistFeedCard';



import { Container, Stack } from 'react-bootstrap';


export default function ArtistFeed({ artists }) {
    return (
        <Container id='feed'>
            <Stack direction="horizontal">
                <h5 id='h5'>Artists</h5>
                <Link id='link' to={'/artists'}><h5>View All</h5></Link>
            </Stack>
            
            <Stack direction='horizontal'>
                {!artists || typeof artists == 'undefined' ? <h2>No Data</h2> : !Array.isArray(artists) ? <h2>Results are not Array</h2> :
                    artists.map((artist, idx) => {
                        return (
                            <ArtistFeedCard artist={artist} key={idx} />
                        )
                    })
                }
            </Stack>
        </Container>

    );
}