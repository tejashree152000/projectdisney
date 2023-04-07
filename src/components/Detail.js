import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { Box, Modal } from "@mui/material";
import { selectUid } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  // bgcolor: "background.paper",
  border: "2px solid #000",
};

const Detail = (props) => {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [isInWatchList, setIsInWatchList] = useState(false);
  const [playerStatus, setPlayerStatus] = useState(false);
  const navigate = useNavigate();
  const uid = useSelector(selectUid);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "movies", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDetailData(docSnap.data());
      } else {
        console.log("no such document in firebase ");
      }
    };
    fetchData();

    checkIfAlreadyInWatchlist();
  }, [id]);

  const handleClick = () => {
    navigate("/video");
  };

  const handlePlayTrailer = () => {
    setPlayerStatus(true);
  };
  const handlePlayerReady = (event) => {
    event.target.playVideo();
  };

  const handleAddToWatchList = async () => {
    const docRef = doc(db, "watchlist", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      let list = data.data;
      list = new Set([...list, id]);
      console.log(list);
      await setDoc(
        doc(db, "watchlist", uid),
        {
          data: [...list],
        },
        { merge: true }
      );
      checkIfAlreadyInWatchlist();
    } else {
      console.log("no such document in firebase ");
      await setDoc(
        doc(db, "watchlist", uid),
        {
          data: [id],
        },
        { merge: true }
      );
      checkIfAlreadyInWatchlist();
    }
  };
  const handleRemoveFromWatchList = async () => {
    const docRef = doc(db, "watchlist", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      let list = data.data;
      list = list.filter((item) => item !== id);
      console.log(list);
      await setDoc(
        doc(db, "watchlist", uid),
        {
          data: [...list],
        },
        { merge: true }
      );

      checkIfAlreadyInWatchlist();
      // setDetailData(docSnap.data());
    } else {
      console.log("no such document in firebase ");
    }
  };
  const checkIfAlreadyInWatchlist = async () => {
    const docRef = doc(db, "watchlist", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      let list = data.data;
      console.log({ list, id });
      setIsInWatchList(list.includes(id));

      // setDetailData(docSnap.data());
    } else {
      console.log("no such document in firebase ");
      setIsInWatchList(false);
    }
  };
  const notify = () =>
    toast.success(
      `${detailData.title} Movie ${
        isInWatchList ? "removed" : "added"
      } to Watchlist!`,
      {
        position: "bottom-right",
      }
    );
  const handleWatchlist = () => {
    notify();
    setIsInWatchList((prev) => !prev);

    if (isInWatchList) {
      handleRemoveFromWatchList();
    } else {
      handleAddToWatchList();
    }
  };

  return (
    <Container>
      <Background>
        <img alt={detailData.title} src={detailData.backgroundImg} />
      </Background>

      <ImageTitle>
        <img alt={detailData.title} src={detailData.titleImg} />
      </ImageTitle>
      <ContentMeta>
        <Controls>
          <Player onClick={handlePlayTrailer}>
            <img src="/images/play-icon-black.png" alt="" />
            <span>Play Trailer</span>
          </Player>
          {/* <Trailer onClick={handlePlayTrailer}>
            <img src="/images/play-icon-white.png" alt="" />
            <span>Trailer</span>
          </Trailer> */}

          <AddList
            className={`${isInWatchList ? "watchlist" : ""}`}
            onClick={handleWatchlist}
          >
            <span />
            <span />
          </AddList>

          <GroupWatch>
            <div>
              <img src="/images/group-icon.png" alt="" />
            </div>
          </GroupWatch>
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
        <Modal
          open={playerStatus}
          onClose={() => setPlayerStatus(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <YouTube
              videoId={detailData?.videoId}
              opts={{
                height: "700px",
                width: "100%",
                playerVars: {
                  autoplay: 1,
                },
              }}
              onReady={handlePlayerReady}
            />
          </Box>
        </Modal>
        {/* {playerStatus && (
          <YouTube
            videoId={detailData?.videoId}
            opts={{
              height: "100%",
              width: "100%",
              playerVars: {
                autoplay: 1,
              },
            }}
            onReady={handlePlayerReady}
          />
        )} */}
      </ContentMeta>
      <ToastContainer />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: calc(100vh-250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;

    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb (249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const AddList = styled.div`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;

  &.watchlist {
    background-color: #00b9ff;
  }
  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`;

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;

    img {
      width: 100%;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default Detail;
