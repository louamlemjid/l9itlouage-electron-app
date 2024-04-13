import React, { useState, useEffect } from 'react';

export default function AchatTicket() {
  const [destination, setDestination] = useState([]);
  const [newTariff, setNewTariff] = useState([]);
  
  useEffect(() => {
    const fetchData = () => {
      // Send request to main process to get city data
      window.electron.ipcRenderer.send('destinations');
    };
    
    fetchData()
  }, []);

  const handleUpdate = (event,name,nombrePlaces) => {
    event.preventDefault();
    // Send POST request to main process with the new tariff value for update
    
    window.electron.ipcRenderer.send('destinations');
    window.electron.ipcRenderer.send('achat-ticket');
    // Fetch updated destinations after submitting the update
    
  };

  const handleChange = (event, index) => {
    const updatedTariff = [...newTariff];
    updatedTariff[index] = event.target.value;
    setNewTariff(updatedTariff);
  };

  // Listen for response from main process
  useEffect(() => {
    const fetchData = () => {
      window.electron.ipcRenderer.on('destinations', (event, listOfDestinations) => {
        // Update state with received data
        setDestination(listOfDestinations);
        
        // Initialize newTariff array with default values
        const defaultTariff = Array.from({ length: listOfDestinations.length }, () => '');
        setNewTariff(defaultTariff);
      });
    };
    
    fetchData();

    // Clean up event listener
    return () => {
      window.electron.ipcRenderer.removeAllListeners('destinations');
    };
  }, []);

  return (
    <div className='tbl-container w-75 '>
      <table className="table m-0">
      <thead>
        <tr className="table-dark bg-danger">
          <th className="text-center" scope="col">La Destination</th>
          <th className="text-center" scope="col">Tarif</th>
          <th className="text-center" scope="col">Places Disponibles</th>
          <th className="text-center" scope="col">Achat Ticket</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {destination.map((item, index) => (
          <tr key={index} className="table-light opacity-75">
            <td className="text-center align-middle">{item.destinationCity}</td>
            <td className="text-center align-middle">{item.tarif}</td>
            <td className="text-center align-middle">20</td>
            <td className="text-center">
              <form id='tariflist' className="d-flex align-items-center w-75 justify-content-center" onSubmit={(event) => handleUpdate(event,item.destinationCity, newTariff[index])}>
                <input 
                  type="number"
                  className="w-50 form-control bg-light text-dark"
                  value={newTariff[index]}
                  onChange={(event) => handleChange(event, index)} 
                />
                <button 
                  className='btn btn-outline-danger' 
                  type="submit"   
                >
                  Acheter
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
