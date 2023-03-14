import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ErrorMessage from '../System/ErrorMessage';
import bidService from '../../utils/bidService';
import userService from '../../utils/userService';
import BidDisplayCard from '../Cards/BidDisplayCard';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

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
                console.log(bids[i])
                handleBidUpdate(bids[i].id);
                i++;
            };
        }
    };

    async function handleBidUpdate(bid){
        try {
            let formData = {
                id: bid.id,
                status: 'COMPLETE'
            };
            await bidService.update(formData);

            handleClose();
        } catch (err) {
            console.log(err.message);
        };
    };

    const ButtonWrapper = ({ type }) => {
        const [{ options }, dispatch] = usePayPalScriptReducer();
    
        useEffect(() => {
            dispatch({
                type: "resetOptions",
                value: {
                    ...options,
                    intent: "authorize",
                },
            });
        }, [type]);
    
        return (<PayPalButtons
            style={{color: 'silver'}}
            createOrder={(data, actions) => {
                return actions.order
                    .create({
                        advanced: {
                            commit: 'true',
                            extraQueryParams: [
                                {
                                    name: 'intent',
                                    value: 'authorize'
                                }
                            ]
                        },
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value: total + '.00',
                                }
                            },
                        ]
                    })
                    .then((orderId) => {
                        console.log('Order Id', orderId);
                        return orderId;
                    });
            }}
            onApprove={function (data, actions) {
                return actions.order.authorize().then(function (details) {
                    console.log(details);
                    if (details.status === "COMPLETED"){
                        handleBidComplete()
                        console.log('Transaction Authorized');
                    } else {
                        console.log('Transaction Incomplete');
                    };
                });
            }}
            onError={(err) => {
                return console.log(err.message)
            }}
        />);
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
                                    <PayPalScriptProvider
                                        options={{
                                            "client-id": process.env.REACT_APP_CLIENT_ID,
                                            components: "buttons",
                                            intent: "authorize"
                                        }}
                                    >
                                        <ButtonWrapper type="authorize" />
                                    </PayPalScriptProvider>
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