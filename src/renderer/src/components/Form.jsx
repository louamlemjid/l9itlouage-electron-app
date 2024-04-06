import React, { useState } from 'react';
import CityDropdown from "./CityDropdown"

function Form(){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send form data to main process
    window.electron.ipcRenderer.send('add',{email:email,password:password,expireDate:expireDate})
    
    // Clear input fields after submission
    setEmail('');
  };


  return (
    <form onSubmit={handleSubmit} id="generalForm" className="w-75 m-auto">
      <h1 className="text-primary fs-2 m-auto w-75">إضافة لواج إلى المحطة</h1>
      <div class="mb-3 input-group">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">First name</span>
                <input type="text" class="form-control bg-transparent text-dark" 
                name="firstNameLouage" id="firstNameLouage" required placeholder="Name"/>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">Last name</span>
                <input type="text" class="form-control bg-transparent text-dark" 
                name="lastNameLouage" id="lastNameLouage" required 
                placeholder="Last name"/>
              </div>
              <div className="input-group mb-3">
            <span className="input-group-text bg-transparent text-dark" id="basic-addon1">Numero Tel</span>
            <input type="number"
              className="form-control bg-transparent text-dark "
              placeholder="tel"
              name="tel" id="tel"
              pattern="[0-9]{8}"
              title="Please enter exactly 8 numbers"
              required />
        </div>
      <div className="input-group mb-3">
          <span className="input-group-text bg-transparent text-dark" id="basic-addon1">@ E-mail</span>
          <input 
          type="text"
          value={email}
          required
          id="email"
          className="form-control bg-transparent text-dark "
          onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div class="input-group mb-3">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">trajet1</span>
                <CityDropdown/>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent text-dark" id="basic-addon1">trajet2</span>
                <CityDropdown/>
              </div>
      <div className="input-group mb-3">
          <span className="input-group-text bg-transparent text-dark" id="basic-addon1">Mot de passe</span>
          <input 
          type="password"
          value={password}
          className="form-control bg-transparent text-dark "
          id="password"
          required
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)} />
      </div>  
      
        <div class="input-group mb-3">
            <span class="input-group-text bg-transparent text-dark" id="basic-addon1">date d'expiration</span>
            <input 
          type="date"
          className="form-control bg-transparent text-dark "
          value={expireDate}
          id="date"
          placeholder='date'
          onChange={(e) => setExpireDate(e.target.value)} />
        </div>
         
        <div id="blocLouage" >
              <div class=" mb-3 matricule w-50 m-auto">
                <div class="text-white matriculeInside ">
                  <input class="text-dark bg-transparent m-auto fs-2 w-100 matrLeft" 
                  type="number" placeholder="240" name="matrLeft" id="matrLeft" required/>
                  <div class="text-white m-auto fs-2">تونس</div>
                  <input className="text-dark bg-transparent m-auto fs-2 w-100 matrRight"
                   type="number" placeholder="9651" name="matrRight" id="matrRight" 
                   required/>
                </div>
                {/* <span class="text-white m-auto">demo</span> */}
              </div>
        </div>
        <button type="submit" class="btn btn-primary w-50 m-auto">إضافة</button>
    </form>
  )
}

export default Form;
