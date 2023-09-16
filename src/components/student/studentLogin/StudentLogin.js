import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import StudentGoogleLogin from '../studentGoogleLogin/StudentGoogleLogin';
import '../../login/Login.css'

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
    <div className='container-fluid vh-100'>
      <main className='login__container'>
        <form className='login__card' onSubmit={handleSubmit}>
          <h3 className='login__header'>Student Login</h3>

          <div className='login__inputBox login__inputBox--email'>
            <input
              type="text"
              required
              onChange={(e) => setValues({ ...values, Student_Email: e.target.value })}
            />
            <span>Email</span>
          </div>

          <div className='login__inputBox login__inputBox--password'>
            <input
              type="password"
              required
              onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
            />
            <span>Password</span>
          </div>

          <div className='login__forgetPassword'>
            <Link className='forgetPassword__text' to="/student-forget-password">Forget Password</Link>
          </div>

          <button type="submit" className='login__btn'>Login</button>

          <div className='login__text'>Or Sign In With</div>

          <StudentGoogleLogin />
          
          <div className='login__text'>Don't have an account? <Link to="/student-register" className='register__text'>Register</Link></div>
        </form>
      </main>
    </div>
  )
}

export default StudentLogin;