
import React, { useState, useEffect } from 'react';
import CityDropdown from './CityDropdown';

function DestinationTarif(){
  const [formData, setFormData] = useState({
    city: '',
    tarif: ''
  });
  const [state,setSate]=useState(false)
  
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Form submitted:', formData);
    addDestination(formData);
  };

  const addDestination = async (newDestination) => {
    // Send request to main process to get city data
    window.electron.ipcRenderer.send('add-destination', newDestination);
  };

  const handleInputChange = (event) => {
          
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  useEffect(() => {
    window.electron.ipcRenderer.on('add-destination', async(event, data) => {
      // Update state with received data
      console.log(`data recived in the react : ${data}`)
      data?setSate(true):null;
    });
    
    // Clean up event listener
    return () => {
      window.electron.ipcRenderer.removeAllListeners('add-destination');
    };
  }, []);

  return (
    <>
    
    <form  id="adminStation" onSubmit={handleSubmit}>
        <label  className="fs-3">Entrer une destination</label>
        <div className="col-md-2 col-4 m-auto input-group">
          <span className="input-group-text bg-transparent text-dark">Destination</span>
        <CityDropdown name="city" value={formData.city} onChange={handleInputChange}></CityDropdown>
        </div>
        <label  className="fs-3">Fixer le prix</label>
        <div className="col-md-2 col-4 m-auto input-group">
            <span className="input-group-text bg-transparent text-dark">Tarif</span>
            <input 
              type="number"
              id="tarif"
              name='tarif' 
              className="form-control bg-dark text-light"
              value={formData.tarif}
              onChange={handleInputChange}
               />
        </div>
        <div className="col-md-2 col-4 m-auto input-group">
          <p className='text-dark fs-3'>{state?"تمت إضافة الوجهة الجديدة":null}</p>
        </div>
        <button type="submit" className="btn btn-dark w-50 m-auto">Ajouter</button>
    </form>
    </>
  );
  }

export default DestinationTarif;
