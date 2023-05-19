import React, { useState, useEffect } from 'react';
import causeService from '../../utils/causeService';
import CauseDisplayCard from '../Cards/CauseDisplayCard';



import { Container, Stack } from 'react-bootstrap';


export default function CausesDisplay() {
    const [causes, setCauses] = useState();

    async function handleGetCauses(){
        try {
            const data = await causeService.getAll();
            setCauses([...data.causes]);
        } catch (err) {
            console.log(err.message);
        };
    };

    useEffect(() => {
        handleGetCauses();
    }, [])

    return (
        <Container>
            <Stack>
                {!causes || typeof causes == 'undefined' ? <h2>No Data</h2> : !Array.isArray(causes) ? <h2>Results are not Array</h2> :
                    causes.map((cause, idx) => {
                        return (
                            <CauseDisplayCard cause={cause} key={idx} />
                        )
                    })
                }
            </Stack>
        </Container>

    );
}