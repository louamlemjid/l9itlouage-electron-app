import receipt from './../assets/receipt.png'
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';
const TicketList=()=>{
    return(
        <div className='tbl-container w-75 '>
            <table className="table m-0">
            <thead>
                <tr className="table-dark bg-danger">
                    <th className="text-center" scope="col">التاريخ</th>
                    <th className="text-center" scope="col">الوفت</th>
                    <th className="text-center" scope="col">التذكرة</th>
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
                <tr className="table-light opacity-75">
                <td  className="text-center">20</td>
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                </tr>
                <tr className="table-light opacity-75">
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                <td className="text-center">20</td>
                </tr>
            </tbody>
            </table>
        </div>
    )
}
export default TicketList