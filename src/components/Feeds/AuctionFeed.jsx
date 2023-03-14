import React from 'react';
import {Link} from 'react-router-dom';
import AuctionFeedCard from '../Cards/AuctionFeedCard';



import { Container, Accordion, Image, Button, Stack } from 'react-bootstrap';


export default function AuctionFeed({ auctions, handleGetBids }) {
    return (
        <Container>
            <Stack direction='horizontal'>
                {!auctions || typeof auctions == 'undefined' ? <h2>No Data</h2> : !Array.isArray(auctions) ? <h2>Results are not Array</h2> :
                    auctions.map((auction, idx) => {
                        return (
                            <AuctionFeedCard auction={auction} key={idx} handleGetBids={handleGetBids} />
                        )
                    })
                }
            </Stack>
        </Container>

    );
}