import React from 'react';
import ErrorMessage from '../System/ErrorMessage';
import SearchDisplayCard from '../Cards/SearchDisplayCard';

import { Container } from 'react-bootstrap';


export default function SearchResults({ results, searchError, sendGetUser }){

  return (
    <Container>
      {!results || typeof results == 'undefined' ? <h2>No Data</h2> : !Array.isArray(results) ? <h2>Results are not Array</h2> :
        results.map((result, idx) => {
          return (
            <SearchDisplayCard result={result} key={idx} sendGetUser={sendGetUser} />
          )
        })
      }
      {searchError ? <ErrorMessage error={searchError} /> : null}
    </Container>
  )

}