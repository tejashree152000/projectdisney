import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Header from './components/Header';
import Home from './components/Home';
import Detail from './components/Detail';

import Playvid from './components/Playvid';
import Register from './components/Register'
import Search from './components/Search';

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
      <Routes>
          <Route exact path='/' element={<Login />}></Route>
          <Route path="/home" element={<Home />} ></Route>
          <Route path="/detail/:id" element={<Detail />}> </Route>  
            <Route path='/video' element={<Playvid />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/search' element={< Search />}></Route> 
            
          </Routes>
          
        </Router>
        
    </div>
  );
}

export default App;
