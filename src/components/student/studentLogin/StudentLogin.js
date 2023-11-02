import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StudentGoogleLogin from '../studentGoogleLogin/StudentGoogleLogin';
import '../../cssElement/Form.css'

function StudentLogin() {
  const [values, setValues] = useState({
    Student_Email: "",
    Student_Password: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginInProgress, setLoginInProgress] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the username exists
    try {
      const response = await axios.get("https://special-problem.onrender.com/student-list");
      const studentList = response.data;
      const student = studentList.find((student) => student.Student_Email === values.Student_Email);

      if (student) {
        setUsernameError("");
      } else {
        setUsernameError("Email does not exist");
        notifyUsername()
        return; // Exit the function early
      }
    } catch (error) {
      console.error("Axios Error:", error);
    }

    // Check if the password is correct
    try {
      const response = await axios.get("https://special-problem.onrender.com/student-list");
      const studentList = response.data;
      const student = studentList.find((student) => student.Student_Password === values.Student_Password);

      if (student) {
        setPasswordError(""); // Password is correct, clear error
      } else {
        setPasswordError("Password is incorrect");
        notifyPassword();
        return
      }
    } catch (error) {
      console.error("Axios Error:", error);
    }

    setLoginInProgress(true);

    // If both username and password are valid, proceed with login
    axios.post("https://special-problem.onrender.com/student-login", values)
      .then((response) => {
        console.log(response.data.Error);
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
      }).finally(() => {
        // Reset login in progress
        setLoginInProgress(false);
      });
  };

  const notifyPassword = () => toast.error("Incorrect password");
  const notifyUsername = () => toast.error("Email does not exist");

  return (
    <div className='container-fluid vh-100'>
      <ToastContainer />
      <main className='form__container'>
        <form className='form__card form__card--login' onSubmit={handleSubmit}>
          <h3 className='form__header'>Student Login</h3>

          <div className='form__inputBox form__inputBox--email'>
            <input
              type="text"
              required
              onChange={(e) => setValues({ ...values, Student_Email: e.target.value })}
            />
            <span>Email</span>
          </div>

          <div className='form__inputBox form__inputBox--password'>
            <input
              type="password"
              required
              onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
            />
            <span>Password</span>
          </div>

          <div className='form__forgetPassword'>
            <Link className='forgetPassword__text' to="/student-forget-password">Forget Password</Link>
          </div>

          {loginInProgress ? (
            <div className="loader">Loading...</div>
          ) : (
            <button type="submit" className='form__btn'>Login</button>
          )}

          <div className='form__text'>Or Sign In With</div>

          <StudentGoogleLogin />

          <div className='form__text'>Don't have an account? <Link to="/student-register" className='form__subtext'>Register</Link></div>
        </form>
      </main>
    </div>
  )
}

export default StudentLogin;