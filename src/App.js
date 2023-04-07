import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import Detail from "./components/Detail";

import Playvid from "./components/Playvid";
import Register from "./components/Register";
import Search from "./components/Search";
import { useDispatch, useSelector } from "react-redux";
import { selectUserName, setUserLoginDetails } from "./features/user/userSlice";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Watchlist from "./components/Watchlist";

function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const userName = useSelector(selectUserName);
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // navigate("/home");
      }
      setLoading(false);
    });
  }, [userName]);

  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      })
    );
  };
  if (loading) {
    return <></>;
  }
  return (
    <div className="App">
      {!userName ? (
        <Router>
          <Header />
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </Router>
      ) : (
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/detail/:id" element={<Detail />}></Route>
            <Route path="/watchlist" element={<Watchlist />}></Route>
            <Route path="/video" element={<Playvid />}></Route>
            <Route path="/search" element={<Search />}></Route>
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
