import React, { useState, useEffect } from 'react';
import auctionService from '../../utils/auctionService';
import CauseDisplayCard from '../Cards/CauseDisplayCard';



import { Container, Stack } from 'react-bootstrap';


export default function AuctionsDisplay() {
    const [auctions, setAuctions] = useState();

    async function handleGetAuctions(){
        try {
            const auctions = await auctionService.getAll();
            setAuctions([...auctions]);
        } catch (err) {
            console.log(err.message);
        };
    };

    useEffect(() => {
        handleGetAuctions();
    }, [])

    return (
        <Container>
            <Stack>
                {!auctions || typeof auctions == 'undefined' ? <h2>No Data</h2> : !Array.isArray(auctions) ? <h2>Results are not Array</h2> :
                    auctions.map((auction, idx) => {
                        return (
                            <CauseDisplayCard cause={auction} key={idx} />
                        )
                    })
                }
            </Stack>
        </Container>

    );
}