import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function StaffRegister() {
  const [values, setValues] = useState({
    Staff_FName: "",
    Staff_LName: "",
    Staff_Username: "",
    Staff_Password: "",
    Staff_Tel: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_API + "/staff-register", values).then((response) => {
      if (response.data.Error) {
        alert(response.data.Error);
      } else {
        navigate(" staff-login");
      }
    });
  };

  return (
    <div className='container-fluid'>
      <h1>Staff Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder='first name'
            onChange={(e) => setValues({ ...values, Staff_FName: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder='last name'
            onChange={(e) => setValues({ ...values, Staff_LName: e.target.value })}
          />
        </div>

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

        <div className="mb-3">
          <label htmlFor="tel" className="form-label">Tel</label>
          <input
            type="text"
            className="form-control"
            placeholder='tel'
            onChange={(e) => setValues({ ...values, Staff_Tel: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Create Account</button>
        <div className="btn-group w-100" role="group">
          <Link to="staff-login" className='btn btn-outline-success w-100'>Login</Link>
        </div>
      </form>
    </div>
  )
}

export default StaffRegister
