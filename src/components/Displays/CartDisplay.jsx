import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import BidDisplayCard from '../Cards/BidDisplayCard';

import { Button, Form, Container, Stack, Modal } from 'react-bootstrap';

export default function CartDisplay({ handleGetBids, bids, subtotal, fees, total }){
    const [show, setShow] = useState(false);

    function handleShow(){
        handleGetBids();
        setShow(true);
    };

    function handleClose(){
        setShow(false);
    };

        
    return (
        <Container style={{width: 'fit-content'}}>
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
            <Link id='link' onClick={handleShow}><h3 id='cartTotal'>${total ? total : 0}.00</h3></Link>
        </Container>
    );   
}