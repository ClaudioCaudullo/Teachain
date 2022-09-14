import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React,{ useContext } from 'react'
import './App.css';

import Home from './components/Home.js'
import Profilo from './components/Profilo.js'
import './styles/App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import CreaCorso from "./components/CreaCorso.js";
import { MainProvider } from './context/MainContext';
import {ModalProvider} from 'react-simple-hook-modal'
import Header from "./components/Header.js";
import Chiamate from "./components/Chiamate"
import Call from './components/Call';
import Main from './components/Main';
import ZoomCorso from "./components/ZoomCorso";
import CorsiAcquistati from "./components/CorsiAcquistati";
import Profilo2 from "./components/Profilo";


function App() {
  return (
 
    <React.StrictMode>
    <MainProvider>
        <ModalProvider>
          <BrowserRouter>
            <Header/>
            <Routes>
              <Route path="/" element={<Main/>} />
              <Route path="/CreaCorso" element={<CreaCorso/>} />
              <Route path="/profilo/:userid" element={<Profilo/>} />
              <Route path="/call" element={<Call/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/corsiAcquistati" element={<CorsiAcquistati/>} />
              <Route path="/zoomCorso/:id" element={<ZoomCorso/>}/>
            </Routes>
          </BrowserRouter>
        </ModalProvider>
    </MainProvider>      
</React.StrictMode>
  );
}

export default App;
