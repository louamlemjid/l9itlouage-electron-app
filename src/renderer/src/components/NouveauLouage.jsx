import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import CityDropdown from "./CityDropdown"


function NouveauLouage(){
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstNameLouage:'',
    lastNameLouage:'',
    tel:'',
    matrLeft:'',
    matrRight:'',
    codeStation:''
});

  const addLouage = async (newLouage) => {
    // Send request to main process to get city data
    window.electron.ipcRenderer.send('add-louage', newLouage);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    addLouage(formData);
    console.log('Form submitted:', formData);
    // Send form data to main process
    
    navigate("/menu/louageliste")
    // Clear input fields after submission
    
  };
  const handleChange = (event) => {
        
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
};

  return (
    
    <form onSubmit={handleSubmit} id="generalForm" className="w-50 ">
      <h1 className="text-dark fs-2 m-auto w-75">إضافة لواج إلى المحطة</h1>
      <div class="mb-3 input-group">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">First name</span>
                <input type="text" class="form-control bg-dark text-light" 
                name="firstNameLouage" id="firstNameLouage" required
                 placeholder="Name"
                 onChange={handleChange}
                 value={formData.firstNameLouage}
                 />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">Last name</span>
                <input type="text" class="form-control bg-dark text-light" 
                name="lastNameLouage" id="lastNameLouage" required 
                placeholder="Last name"
                onChange={handleChange}
                value={formData.lastNameLouage}
                />
              </div>
              <div className="input-group mb-3">
            <span className="input-group-text bg-transparent text-dark" id="basic-addon1">Numero Tel</span>
            <input type="number"
              className="form-control bg-dark text-light "
              placeholder="tel"
              name="tel" id="tel"
              pattern="[0-9]{8}"
              value={formData.tel}
              onChange={handleChange}
              title="Please enter exactly 8 numbers"
              required />
        </div>
      <div className="input-group mb-3">
          <span className="input-group-text bg-transparent text-dark" id="basic-addon1">@ E-mail</span>
          <input 
          type="text"
          value={formData.email}
          name='email'
          required
          id="email"
          className="form-control bg-dark text-light "
          onChange={handleChange} />
      </div>
      <div class="input-group mb-3">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">trajet1</span>
                <CityDropdown name="trajet1" value={formData.trajet1} onChange={handleChange}/>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">trajet2</span>
                <CityDropdown name="trajet2" value={formData.trajet2} onChange={handleChange}/>
              </div>
      <div className="input-group mb-3">
          <span className="input-group-text bg-transparent text-dark" id="basic-addon1">Mot de passe</span>
          <input 
          type="password"
          name='password'
          value={formData.password}
          className="form-control bg-dark text-light "
          id="password"
          required
          placeholder='password'
          onChange={handleChange} />
      </div>  
      
        <div class="input-group mb-3">
            <span class="input-group-text bg-transparent text-dark" id="basic-addon1">codeStation</span>
            <input 
          type="text"
          className="form-control bg-dark text-light "
          value={formData.codeStation}
          id="codeStation"
          placeholder='code'
          name='codeStation'
          onChange={handleChange} />
        </div>
        
        <div class=" mb-3 matricule w-50 m-auto">
          <div class="text-white matriculeInside ">
            <input class="bg-dark text-light m-auto fs-2 w-100 matrLeft" 
            type="number" placeholder="240" name="matrLeft" id="matrLeft" 
            required
            value={formData.matrLeft}
            onChange={handleChange}/>
            <div class="text-white m-auto fs-2">تونس</div>
            <input className="bg-dark text-light m-auto fs-2 w-100 matrRight"
             type="number" placeholder="9651" name="matrRight" id="matrRight" 
             required
             value={formData.matrRight}
             onChange={handleChange}/>
          </div>
          {/* <span class="text-white m-auto">demo</span> */}
        </div>
        
        <button type="submit" class="btn btn-dark w-25 m-auto">إضافة</button>
    </form>
  )
}

export default NouveauLouage;
