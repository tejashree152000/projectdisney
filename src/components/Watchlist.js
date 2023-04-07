import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { selectUid } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { Button, Grid, Paper } from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";
function Watchlist() {
  const [watchlistData, setWatchlistData] = useState([]);
  const uid = useSelector(selectUid);

  useEffect(() => {
    getList();

    return () => {};
  }, []);

  const getList = async () => {
    const docRef = doc(db, "watchlist", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      let watchlistIds = data.data;

      onSnapshot(collection(db, "movies"), (snapshot) => {
        snapshot.docs.map((doc) => {
          if (watchlistIds.includes(doc.id)) {
            const _watchlisOnetData = { id: doc.id, ...doc.data() };
            if (
              watchlistData.filter((item) => item.id === _watchlisOnetData.id)
                .length === 0
            ) {
              setWatchlistData((prev) => [...prev, _watchlisOnetData]);
            }
          }
        });
      });
    } else {
      console.log("no such document in firebase ");
    }
  };
  return (
    <div
      style={{
        marginTop: "5rem",
        padding: "2rem",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Watchlist</h2>

      {watchlistData.length > 0 && (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {watchlistData.map((movie) => (
            <Grid item xs={2} sm={4} md={4}>
              <Link to={`/detail/` + movie.id}>
                <img src={movie.cardImg} alt={movie.title} />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default Watchlist;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  margin: 3rem;
  height: 100vh;
`;
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
