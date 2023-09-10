import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StaffForgetPassword() {
    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post("https://backup-test.onrender.com/staff-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                navigate("/staff-login");
            }
        });
    };

    return (
        <div className='container-fluid'>
            <h1>Staff Forget Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        onChange={(e) => setValues({ ...values, Staff_Username: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        onChange={(e) => setValues({ ...values, Staff_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default StaffForgetPassword
