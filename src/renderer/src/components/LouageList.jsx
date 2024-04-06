import React, { useState, useEffect } from 'react';

export default function LouageList(){
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Send request to main process to get city data
      window.electron.ipcRenderer.send('get-city', 'aslema');
    };

    fetchData();

    const interval = setInterval(fetchData, 1000); // Fetch data every 2 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Listen for response from main process
  useEffect(() => {
    window.electron.ipcRenderer.on('city-data', (event, data) => {
      // Update state with received data
      setCityData(data);
    });

    // Clean up event listener
    return () => {
      window.electron.ipcRenderer.removeAllListeners('city-data');
    };
  }, []);
    return (
        <table className="table table-hover w-75 ">
        <thead>
          <tr className="table-dark">
            <th className="text-center" scope="col">email</th>
            <th className="text-center" scope="col">password</th>
            <th className="text-center" scope="col">date d'expiration</th>
            <th className="text-center" scope="col">check out</th>
            <th className="text-center" scope="col">paiment</th>
            <th className="text-center" scope="col">effecter</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {cityData.map((item) => (
            <tr key={item._doc.email} className="table-light opacity-75">
              <td className="text-center">{item._doc.email}</td>
              <td className="text-center">{item._doc.password}</td>
              <td className="text-center">{fullDate(item._doc.expireDate)}</td>
              <td className="text-center"><button className='btn btn-primary'>faire sortir</button></td>
              <td className="text-center text-danger">non</td>
              <td className="text-center"><button className='btn btn-success'>payer</button></td>
            </tr>
          ))} 
        </tbody>
      </table>
    )
}

const fullDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };