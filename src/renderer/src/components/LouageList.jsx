import React, { useState, useEffect } from 'react';
import pluslogo from './../assets/transport.png'
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';

export default function LouageList(){
  const [cityData, setCityData] = useState([]);
  const [louages, setLouages] = useState([]);
  const [paidLouages,setPaidLouages]=useState([])

  const idToMatricule=(id,arrayLouages)=>{
    for (let i=0;i<arrayLouages.length;i++){
      if(arrayLouages[i]._id==id){return arrayLouages[i].matricule}
    }
  }
  const idInPaidList=(id,arrayLouages)=>{
    for (let i=0;i<arrayLouages.length;i++){
      if(arrayLouages[i]==id){return true}else{
        
      }
    }return false
  }
  const idToPlaces=(id,arrayLouages)=>{
    for (let i=0;i<arrayLouages.length;i++){
      if(arrayLouages[i]._id==id){return arrayLouages[i].availableSeats}
    }
  }
  const idToStatus=(id,arrayLouages)=>{
    for (let i=0;i<arrayLouages.length;i++){
      if(arrayLouages[i]._id==id){return arrayLouages[i].status}
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // Send request to main process to get city data
      window.electron.ipcRenderer.send('destinations');

    };

    fetchData();

    
  }, []);
  const handleCheckOut = (data) => {
    // Send POST request to main process with the email for check out
    window.electron.ipcRenderer.send('check-out', data);
  };

  const handlePayment = (id) => {
    // Send POST request to main process with the email for payment
    window.electron.ipcRenderer.send('paiment', id);
  };
  // Listen for response from main process
  useEffect(() => {
    window.electron.ipcRenderer.on('destinations', (event, data,listeouages,paidLouagesList) => {
      // Update state with received data
      setCityData(data);
      setLouages(listeouages)
      setPaidLouages(paidLouagesList)
      console.log(listeouages,"paidlouages: ",paidLouagesList)
    });

    // Clean up event listener
    return () => {
      window.electron.ipcRenderer.removeAllListeners('destinations');
    };
  }, []);
    return (
      <div className='tbl-container w-75'>
      <table className="table m-0 table-hover">
        <thead>
          <tr className="table-dark">
            <th className="text-center w-25" scope="col">Destination</th>
            <th className="text-center  " scope="col">Louages</th>
            <th className="text-center" scope="col">Places</th>
            <th className="text-center" scope="col">check out</th>
            <th className="text-center" scope="col">louage inStation</th>
            <th className="text-center" scope="col">effecter paiment</th>
            <th className="text-center" scope="col">louage a payé</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
        <tr className="table-light opacity-75 m-auto" >
          <td colSpan={7} className="m-auto" id='imageLoc'>
            <Link to="/menu/nouveaulouage" >
              <img src={pluslogo} alt="" width={40} id='locimg' />
            </Link>
          </td>
        </tr>
  {cityData.map((destination, index) => (
    <React.Fragment key={index}>
      {destination.lougeIds.map((louage, secondIndex) => (
        <tr key={secondIndex} className="opacity-75">
          {secondIndex === 0 ? (
            <td className="text-center align-middle" rowSpan={destination.lougeIds.length}>
              {destination.destinationCity}
            </td>
          ) : null}
          <td className="text-center align-middle">{idToMatricule(louage, louages)}</td>
          <td className="text-center align-middle">{idToPlaces(louage, louages)}</td>
          <td className="text-center"><button className='btn btn-primary' onClick={()=>handleCheckOut({id:louage,cityName:destination.destinationCity})} >faire sortir</button></td>
          {/* <td className={`text-center ${idToStatus(louage, louages) ? 'text-success' : 'text-danger'}`}>{idToStatus(louage, louages)?"في المحطة":"مش في المحطة"}</td> */}
              <td className="text-center"><button className='btn btn-success' onClick={()=>handlePayment(louage)} hidden={idInPaidList(louage, paidLouages)? true : false} >payer</button></td>
              <td className={`text-center ${idInPaidList(louage, paidLouages)? 'text-success' : 'text-danger'}`}>{idInPaidList(louage, paidLouages)?"خالص":"مش خالص"}</td>
        </tr>
      ))}
    </React.Fragment>
  ))}
</tbody>


      </table>
      </div>
    )
}

const fullDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };