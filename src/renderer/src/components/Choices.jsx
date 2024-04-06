import dest from "./../assets/destination.png"
import qrscan from "./../assets/scan-qr-scanner.png"
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';

function Choices(){
    return(
        <div className="choices">
        <Link to="/entree" className="m-auto" >
            
            
            <button type="submit" id="menuform" className="m-auto">
                <img src={qrscan} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-5">Entrée</label>
                
            </button>
        </Link>
        <Link to="/sortie" className="m-auto" >
            
            <button type="submit" id="menuform" >
                <img src={qrscan} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-5">Sortie</label>
                
            </button>
        </Link>
        <Link to="/destination" className="m-auto">
            
            <button type="submit" id="menuform" >
                <img src={dest} alt="" width="70" className="m-auto" />
                <label className="m-auto fs-5" >Ajouter</label>     
            </button>
        </Link>
    </div>
    )
}
export default Choices;