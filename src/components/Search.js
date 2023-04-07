import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh;
`;

const SearchBar = styled.input`
  padding: 20px;
  margin: 40px;
  margin-top: 15vh;
  width: 80vw;
  font-size: 20px;
  border: 1px solid white;
  color: white;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  background-color: transparent;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchData = () => {
    setSearchLoading(true);
    const collectionref = collection(db, "movies");
    const q = query(
      collectionref,
      where("movie_label", "==", `${searchTerm.toLowerCase()}`)
      // orderBy("title", "asc")
    ); //
    const unsub = onSnapshot(q, (snapshot) => {
      setSearchLoading(false);
      setSearchResults(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, key: doc.id }))
      );
    });
    return unsub;

    // const q = query(
    //   collection(db, "items"),
    //   where("name", ">=", searchTerm),
    //   where("name", "<=", searchTerm + "\uf8ff")
    // );
    // onSnapshot(q, (snapshot) => {
    //   const results = [];
    //   snapshot.forEach((doc) => {
    //     results.push({
    //       id: doc.id,
    //       data: doc.data(),
    //     });
    //   });
    //   setSearchResults(results);
    // });
  };

  // useEffect(() => {
  //   searchData();
  // }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const onClickSearch = () => {
    searchData();
  };

  return (
    <Container>
      <SearchBar
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button
        variant="outlined"
        style={{ marginBottom: "20px" }}
        onClick={onClickSearch}
      >
        Search
      </Button>
      {searchResults.length === 0 && !searchLoading && (
        <h2>No Movie Found! Please Search</h2>
      )}
      {searchResults.length > 0 && (
        <Container>
          <Grid container rowSpacing={1}>
            {searchResults.map((movie) => (
              <Grid item xs={6} key={movie.key}>
                <Paper>
                  <div key={movie.key}>
                    <Link to={`/detail/` + movie.id}>
                      <img src={movie.cardImg} alt={movie.title} />
                    </Link>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Container>
  );
};

const Wrap = styled.div`
  padding-top: 56.25%;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);
  img {
    inset: 0px;
    display: block;
    height: 100%;
    object-fit: cover;
    opacity: 1;
    position: absolute;
    transition: opacity 500ms ease-in-out 0s;
    width: 100%;
    z-index: 1;
    top: 0;
  }
  &:hover {
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;

export default Search;
