import logo from "./../assets/logo.png"
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';

function Header(){
    
    return(
        <nav  className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div id="logoheader">
            <img src={logo} alt="a building" width="40" className="m-1" />
            <p className="navbar-brand m-auto">L9itLouage</p>
            </div>
            
            <div id="links">
            <Link to="/menu" className="navbar-brand m-auto " id="link">Menu</Link> {/* Changed the link text */}
            <Link to="/" className="navbar-brand m-auto " id="link">Se connecter</Link> {/* Changed the link text */}
            </div>
        </nav>
    )
}
export default Header;