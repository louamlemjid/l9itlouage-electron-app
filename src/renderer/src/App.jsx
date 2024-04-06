import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Footer from './components/Footer';
import Header from "./components/Header";
import Choices from './components/Choices';
import DestinationTarif from './components/DestinationTarif';
import NouveauLouage from './components/NouveauLouage';
import LouageList from './components/LouageList';
import Signin from './components/Signin';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="menu/*" element={<MenuRoutes />} />
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </>
  );
}

function MenuRoutes() {
  return (
    <Routes>
      <Route index element={<Choices />} />
      <Route path="nouvelledestination" element={<DestinationTarif />} />
      <Route path="nouveaulouage" element={<NouveauLouage />} />
      <Route path="louageliste" element={<LouageList />} />
    </Routes>
  );
}

export default App;
