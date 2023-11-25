import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function TeacherRegister() {
  const [values, setValues] = useState({
    Teacher_FName: "",
    Teacher_LName: "",
    Teacher_Username: "",
    Teacher_Password: "",
    Teacher_Tel: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_API + "/teacher-register", values).then((response) => {
      if (response.data.Error) {
        alert(response.data.Error);
      } else {
        navigate("/chem/teacher-login");
      }
    });
  };

  return (
    <div className='container-fluid'>
      <h1>Teacher Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder='first name'
            onChange={(e) => setValues({ ...values, Teacher_FName: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder='last name'
            onChange={(e) => setValues({ ...values, Teacher_LName: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder='username'
            onChange={(e) => setValues({ ...values, Teacher_Username: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder='password'
            onChange={(e) => setValues({ ...values, Teacher_Password: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tel" className="form-label">Tel</label>
          <input
            type="text"
            className="form-control"
            placeholder='tel'
            onChange={(e) => setValues({ ...values, Teacher_Tel: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Create Account</button>
        <div className="btn-group w-100" role="group">
          <Link to="/chem/teacher-login" className='btn btn-outline-success w-100'>Login</Link>
        </div>
      </form>
    </div>
  )
}

export default TeacherRegister