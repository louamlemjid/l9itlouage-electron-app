import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Footer from './components/Footer';
import Header from "./components/Header";
import Choices from './components/Choices';
import DestinationTarif from './components/DestinationTarif';
import NouveauLouage from './components/NouveauLouage';
import LouageList from './components/LouageList';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Navigation from './components/Navigation';
import DestinationTarifList from './components/DestinationTarifList';
import AchatTicket from './components/AchatTicket';
import TicketList from './components/TicketList';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="menu/*" element={<MenuRoutes  />} />
          <Route path="signup" element={<Signup  />} />
          
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </>
  );
}

function MenuRoutes() {
  return (
    <>
    <div id="links">
            <Link to="/menu" className="navbar-brand m-auto " id="link">Menu</Link> {/* Changed the link text */}
            
        </div>
    <Routes>
      <Route index element={<Choices />} />
      <Route path="nouvelledestination" element={<DestinationTarif />} />
      <Route path="nouveaulouage" element={<NouveauLouage />} />
      <Route path="louageliste" element={<LouageList />} />
      <Route path="destinationtarifliste" element={<DestinationTarifList />} />
      <Route path="achatticket" element={<AchatTicket />} />
      <Route path="ticketliste" element={<TicketList />} />
    </Routes>
    </>
  );
}

export default App;
