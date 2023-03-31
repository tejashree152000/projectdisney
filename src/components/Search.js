import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;

height: 100vh;
`;

const SearchBar = styled.input`
padding: 10px;
margin: 20px;
width: 300px;
border: none;
border-radius: 5px;
box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
font-size: 16px;


&::placeholder {
  
}
  
`;

const SearchResults = styled.ul`
list-style: none;
padding: 0;
margin: 0;

`;

const SearchResult = styled.li`
padding: 10px;
width: 300px;
border-radius: 5px;
box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
margin-bottom: 10px;


`;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "items"), where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"));
    onSnapshot(q, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSearchResults(results);
      });
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>
      <SearchBar placeholder="Search..." value={searchTerm} onChange={handleSearch} />
      <SearchResults>
        {searchResults.map((result) => (
          <SearchResult key={result.id}>{result.data.name}</SearchResult>
        ))}
      </SearchResults>
    </Container>
  );
};

export default Search;
