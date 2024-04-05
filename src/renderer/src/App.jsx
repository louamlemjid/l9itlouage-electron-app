
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';

import Footer from './components/Footer';

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Link to="/">Home</Link> {/* Changed the link text */}
        <Link to="hi">kd</Link> {/* Changed the link text */}
        <Routes>
          <Route index path="/" element={<Footer/>} />
          <Route  path="hi" element={<h1>ddddddddddd</h1>} />
        </Routes>
      </BrowserRouter>
      {/* Moved Footer outside of Router */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
