import logo from "./../assets/logo.png"
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';

function Header(){
    
    return(
        <nav  className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div id="logoheader">
            <img src={logo} alt="a building" width="40" className="m-1" />
            <p className="navbar-brand m-auto">L9itLouage</p>
            </div>
            
            
            
        </nav>
    )
}
export default Header;
