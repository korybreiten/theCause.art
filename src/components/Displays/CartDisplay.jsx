import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ErrorMessage from '../System/ErrorMessage';
import bidService from '../../utils/bidService';
import BidDisplayCard from '../Cards/BidDisplayCard';

import { Button, Form, Container, Stack, Modal, Image, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import auctionService from '../../utils/auctionService';

export default function CartDisplay({ profileData, handleGetBids, bids, subtotal, fees, total }){
    const [payee, setPayee] = useState();
    const [auctionId, setAuctionId] = useState();
    const [show, setShow] = useState(false);

    function handleShow(){
        handleGetBids();
        setShow(true);
    };

    function handleClose(){
        setShow(false);
    };

    function handleBidComplete() {
        let i = 0;
        if (i < bids.length) {
            if (bids[i].status !== 'COMPLETE') {
                handleBidUpdate(bids[i].id);
                console.log("BID", bids[i], "COMPLETED");
                i++;
            };
        }
    };

    async function handleBidUpdate(bidId){
        try {
            let formData = {
                id: bidId,
                status: 'COMPLETE'
            };
            await bidService.update(formData);

            handleClose();
        } catch (err) {
            console.log(err.message);
        };
    };
        
    return (
        <Container>
            <Form  autoComplete="off">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Checkout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack>
                            <h4>Bids are not finalized until after checkout.</h4>
                            <Stack direction='horizontal'>
                                <Stack>
                                    {!bids || typeof bids == 'undefined' ? <h2>No Data</h2> : !Array.isArray(bids) ? <h2>Results are not Array</h2> :
                                        bids.map((bid, idx) => {
                                            return (
                                                <BidDisplayCard bid={bid} key={idx} handleGetBids={handleGetBids} />
                                            )
                                        })
                                        
                                    }
                                </Stack>
                                <Stack id='cartRightStack'>
                                    <h4>Subtotal: ${subtotal ? subtotal : 0}.00</h4>
                                    <h4>Fees: ${fees ? fees : 0}.00</h4>
                                    <h3>Total: ${total ? total : 0}.00</h3>
                                </Stack>
                            </Stack>
                        </Stack>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Form>
            <Stack direction='horizontal'>
                <Link id='cartIcon' className='bi bi-cart4' onClick={handleShow} />
                <Link id='link' className='ms-auto' onClick={handleShow}><h3 id='cartTotal'>${total ? total : 0}.00</h3></Link>
            </Stack>
        </Container>
    );   
}