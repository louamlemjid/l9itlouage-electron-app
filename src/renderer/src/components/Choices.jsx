import dest from "./../assets/destination.png"

import register from "./../assets/register.png"
import ticket from "./../assets/ticket.png"
import addLocation from "./../assets/add-location.png" 
import taxi from "./../assets/taxis.png"
import ticketMachine from "./../assets/ticket-machine.png"

import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';

function Choices(){
    return(
        <div className="choices">

        <Link to="/menu/nouveaulouage" className="m-auto" >
            <button  id="menuform" className="m-auto">
                <img src={register} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-6">Nouveau Louage</label>
            </button>
        </Link>

        <Link to="/destinationtarifliste" className="m-auto" >
            <button  id="menuform" >
                <img src={dest} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-6">Destinations Tarif Liste</label>
            </button>
        </Link>

        <Link to="/menu/nouvelledestination" className="m-auto">
            <button  id="menuform" >
                <img src={addLocation} alt="" width="70" className="m-auto" />
                <label className="m-auto fs-6" >Nouvelle Destination</label>     
            </button>
        </Link>

        <Link to="/menu/louageliste" className="m-auto" >
            <button  id="menuform" >
                <img src={taxi} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-6">Louage Liste</label>
            </button>
        </Link>

        <Link to="/ticketliste" className="m-auto" >
            
            <button  id="menuform" >
                <img src={ticket} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-6">Ticket Liste</label>
                
            </button>
        </Link>

        <Link to="/achatticket" className="m-auto" >
            <button  id="menuform" >
                <img src={ticketMachine} alt="" width="70" className="m-auto" />
                <label for="" className="m-auto fs-6">Achat Ticket</label>
            </button>
        </Link>

    </div>
    )
}
export default Choices;