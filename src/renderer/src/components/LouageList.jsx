import React, { useState, useEffect } from 'react';

export default function LouageList(){
  const [cityData, setCityData] = useState([]);
  const [louages, setLouages] = useState([]);

  const idToMatricule=(id,arrayLouages)=>{
    for (let i=0;i<arrayLouages.length;i++){
      if(arrayLouages[i]._id==id){return arrayLouages[i].matricule}
    }
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

  const handlePayment = (email) => {
    // Send POST request to main process with the email for payment
    window.electron.ipcRenderer.send('payment', email);
  };
  // Listen for response from main process
  useEffect(() => {
    window.electron.ipcRenderer.on('destinations', (event, data,listeouages) => {
      // Update state with received data
      setCityData(data);
      setLouages(listeouages)
      console.log(listeouages)
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
          <td className={`text-center ${idToStatus(louage, louages) ? 'text-success' : 'text-danger'}`}>{idToStatus(louage, louages)?"في المحطة":"مش في المحطة"}</td>
              {/* <td className="text-center"><button className='btn btn-success' onClick={()=>handlePayment(louage)}>payer</button></td>
              <td className={`text-center ${idToPay(louage, louages)? 'text-success' : 'text-danger'}`}>{idToPay(louage, louages)?"خالص":"مش خالص"}</td> */}
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