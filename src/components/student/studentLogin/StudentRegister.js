import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css'

function StudentRegister() {
    const [values, setValues] = useState({
        Student_Id: "",
        Student_FName: "",
        Student_LName: "",
        Student_Email: "",
        Student_Password: "",
        Student_Tel: "",
    });

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(process.env.REACT_APP_API + "/student-register", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                toast.success('Please wait for the admin to approve your account');
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <main className='form__container'>
                <form className='form__card form__card--signup' onSubmit={handleSubmit}>
                    <h3 className='form__header'>Student Sign up</h3>

                    <div className='form__inputBox form__inputBox--id'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_Id: e.target.value })}
                        />
                        <span>Student Id</span>
                    </div>

                    <div className='form__inputBox form__inputBox--fname'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_FName: e.target.value })}
                        />
                        <span>First Name</span>
                    </div>

                    <div className='form__inputBox form__inputBox--lname'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_LName: e.target.value })}
                        />
                        <span>Last Name</span>
                    </div>

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

                    <div className='form__inputBox form__inputBox--tel'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_Tel: e.target.value })}
                        />
                        <span>Tel</span>
                    </div>

                    <button type="submit" className='form__btn'>Create Account</button>
                    <div className='form__text'>Already have an account? <Link to=" student-login" className='form__subtext'>Login</Link> </div>
                </form>
            </main>
        </div>
    )
}

export default StudentRegister
