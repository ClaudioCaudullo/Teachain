import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";

import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import "./styles/App.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import CreateCourse from "./components/CreateCourse.js";
import { MainProvider } from "./context/MainContext";
import { ModalProvider } from "react-simple-hook-modal";
import Header from "./components/Header.js";
import Conference from "./components/Conference";
import Main from "./components/Main";
import ZoomCourse from "./components/ZoomCourse";
import CoursesPurchased from "./components/CoursesPurchased";

function App() {
  return (
    <React.StrictMode>
      <MainProvider>
        <ModalProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/CreaCorso" element={<CreateCourse />} />
              <Route path="/profilo/:userid" element={<Profile />} />
              <Route path="/call" element={<Conference />} />
              <Route path="/home" element={<Home />} />
              <Route path="/corsiAcquistati" element={<CoursesPurchased />} />
              <Route path="/zoomCorso/:id" element={<ZoomCourse />} />
            </Routes>
          </BrowserRouter>
        </ModalProvider>
      </MainProvider>
    </React.StrictMode>
  );
}

export default App;
