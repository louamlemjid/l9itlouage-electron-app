import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [state, setSate] = useState(false);
    const navigate = useNavigate();
    const fetchData = async (dataToFetch) => {
        // Send request to main process to get city data
        window.electron.ipcRenderer.send('find', dataToFetch);
      };
  
      
    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted:', formData);
        fetchData(formData);
        
        // Update state with received data
        // if(data){
        //     setSate(true);
        //     console.log("data is fetched")
        // }
        console.log(`the state :  ${state}`)
    };
    console.log('Component mounted');
    // Function to handle input changes
    const handleInputChange = (event) => {
        
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    useEffect(() => {
        window.electron.ipcRenderer.on('find', (event, data) => {
          // Update state with received data
          console.log(`data recived in the react : ${data}`)
          data?setSate(true):null;
        });
        console.log(`the is the state inside useeffect : ${state}`)
        if(state){
            navigate("/menu")
        }
        // Clean up event listener
        return () => {
          window.electron.ipcRenderer.removeAllListeners('find');
        };
      }, [state]);
    // useEffect(() => {
        
    // }, [])
    
        // if (fetchedData.fetchedEmail !== "" ) {
        //     navigate('/menu'); // Navigate to the menu route
        // }
        
        
        // return () => {
        //     // Clean up event listener to avoid memory leaks
        //     window.electron.ipcRenderer.removeAllListeners('find');
        // };
    ; // Runs once on component mount

   

    

    return (
        <form onSubmit={handleSubmit} id="signin" className="w-75 btnn">
            
            <h1 className="text-primary fs-1 m-auto w-75">تسجيل الدخول</h1>
            <div className="input-group mb-3">
                <span className="input-group-text bg-transparent text-dark" id="basic-addon1">@</span>
                <input
                    type="email"
                    className="form-control bg-transparent text-dark"
                    placeholder="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text bg-transparent text-dark" id="basic-addon1">PASSWORD</span>
                <input
                    type="password"
                    className="form-control bg-transparent text-dark"
                    placeholder="PASSWORD"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <Link to="/signup" id="signuplink">الاشتراك</Link>
            <div className="col-auto w-25 m-auto">
                <button type="submit" className="btn btn-primary mb-2 ">Connecter</button>
            </div>
        </form>
    );
};

export default Signin;
