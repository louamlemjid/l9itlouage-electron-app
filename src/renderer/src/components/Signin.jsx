import React, { useState } from 'react';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here, you can access form data from formData state
        console.log('Form data:', formData);
    };

    return (
        <form id="signin" className="w-75 btnn" onSubmit={handleSubmit}>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                />
            </div>
            {/* Replaced anchor tag with Link */}
            <a id="signuplink" href="#" className="text-dark">اشتراك</a> 
            <div className="col-auto w-25 m-auto">
                <button type="submit" className="btn btn-primary mb-2 ">Connecter</button>
            </div>
        </form>
    );
};

export default Signin;
