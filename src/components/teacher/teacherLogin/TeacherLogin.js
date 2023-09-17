import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Form.css'

function TeacherLogin({ login }) {
    const [values, setValues] = useState({
        Teacher_Username: "",
        Teacher_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/teacher-login", values)
            .then((response) => {
                console.log(response);
                if (response.data.Error) {
                    alert(response.data.Error);
                } else {
                    const token = response.data.token;
                    localStorage.setItem("teacherToken", token);
                    login();
                    navigate("/teacher-dashboard");
                }
            })
            .catch((error) => {
                console.error("Axios Error:", error);
            });
    };

    return (
        <div className='container-fluid vh-100'>
            <main className='form__container'>
                <form className='form__card form__card--adminlogin' onSubmit={handleSubmit}>
                    <h3 className='form__header'>Teacher Login</h3>
                    <div className='form__inputBox form__inputBox--username'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Teacher_Username: e.target.value })}
                        />
                        <span>Username</span>
                    </div>

                    <div className='form__inputBox form__inputBox--password'>
                        <input
                            type="password"
                            required
                            onChange={(e) => setValues({ ...values, Teacher_Password: e.target.value })}
                        />
                        <span>Password</span>
                    </div>

                    <div className='form__forgetPassword'>
                        <Link to="/teacher-forget-password" className='forgetPassword__text'>Forgot password</Link>
                    </div>
                    <button type="submit" className='form__btn'>Login</button>
                </form>
            </main>
        </div>
    )
}

export default TeacherLogin