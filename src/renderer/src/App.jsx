
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';
import Footer from './components/Footer';
import Header from "./components/Header"
import Choices from './components/Choices'
import DestinationTarif from './components/DestinationTarif'
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Header></Header>
        
        <Routes>
          <Route index path="/" element={<Choices/>} />
          <Route  path="hi" element={<DestinationTarif></DestinationTarif>} />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
      {/* Moved Footer outside of Router */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
