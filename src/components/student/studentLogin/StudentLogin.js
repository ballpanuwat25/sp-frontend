import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import StudentGoogleLogin from '../studentGoogleLogin/StudentGoogleLogin';

function StudentLogin() {
  const [values, setValues] = useState({
    Student_Email: "",
    Student_Password: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/student-login", values)
      .then((response) => {
        console.log(response);
        if (response.data.Error) {
          alert(response.data.Error);
        } else {
          const token = response.data.token;
          localStorage.setItem("studentToken", token);
          navigate("/student-dashboard");
        }
      })
      .catch((error) => {
        console.error("Axios Error:", error);
      });
  };

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center vh-100'>
      <form className='form-control w-50' onSubmit={handleSubmit}>
        <h3 className='mb-3'>Student Login</h3>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            placeholder='email'
            onChange={(e) => setValues({ ...values, Student_Email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder='password'
            onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
        <div className='d-flex justify-content-between align-items-center w-100 gap-2'>
          <Link to="/student-register" className="btn btn-outline-primary w-100">Register</Link>
          <Link to="/student-forget-password" className="btn btn-outline-primary w-100">Forget Password</Link>
        </div>

        <hr />
        <div className='d-flex justify-content-center align-items-center mb-2'>
          <StudentGoogleLogin />
        </div>
      </form>
    </div>
  )
}

export default StudentLogin;