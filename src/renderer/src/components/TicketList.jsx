import { useState ,useEffect} from 'react';
import receipt from './../assets/receipt.png'
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';
const TicketList=()=>{
    const [listOfTickets,setListOfTickets]=useState([])

    const fullDate=(date)=>{
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    }
    useEffect(() => {
        const fetchData = async () => {
          window.electron.ipcRenderer.send('tickets');
        };
        fetchData();
      }, []);
    
    
      useEffect(() => {
        window.electron.ipcRenderer.on('tickets', (event, tickets) => {
          // Update state with received data
          setListOfTickets(tickets)
          console.log(tickets)
        });
    
        // Clean up event listener
        return () => {
          window.electron.ipcRenderer.removeAllListeners('destinations');
        };
      }, []);

    return(
        <div className='tbl-container w-75 '>
            <table className="table m-0">
            <thead>
                <tr className="table-dark bg-danger">
                    <th className="text-center" scope="col">التاريخ</th>
                    <th className="text-center" scope="col">الوجهة</th>
                    <th className="text-center" scope="col">اللواج</th>
                    <th className="text-center" scope="col">العدد</th>
                    <th className="text-center" scope="col">السعر</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
            <tr className="table-light opacity-75 m-auto" >
                <td colSpan={5} className="m-auto" id='imageLoc'>
                    <Link to="/menu/achatticket" >
                    <img src={receipt} alt="" width={40} id='locimg' />
                    </Link>
                </td>
            </tr>
            {listOfTickets.map((ticket,index)=>(
                
                <tr key={index} className="table-light ">
                    <td  className="text-center">{fullDate(ticket.dateOfReservation)}</td>
                    <td className="text-center">{ticket.destination}</td>
                    <td className="text-center">{ticket.matriculeLouage}</td>
                    <td className="text-center">{ticket.numberOfTickets}</td>
                    <td className="text-center">{ticket.price}</td>
                
            </tr>
            ))}
            
                
            </tbody>
            </table>
        </div>
    )
}
export default TicketList