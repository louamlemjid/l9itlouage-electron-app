import { Link } from "react-router-dom"
const Navigation=()=>{
    return(
        <div id="links">
            <Link to="/menu" className="navbar-brand m-auto " id="link">Menu</Link> {/* Changed the link text */}
            <Link to="/" className="navbar-brand m-auto " id="link">Se connecter</Link> {/* Changed the link text */}
        </div>
    )
}
export default Navigation;