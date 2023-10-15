import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css'

function StaffForgetPassword() {
    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Email: "",
    });

    axios.defaults.withCredentials = true;

    const notify = () => toast.info("Please check your email for the reset link, you can close this tab now");

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("https://special-problem.onrender.com/staff-forget-password", values)
            .then((response) => {
                console.log(response);
                if (response.data.Error) {
                    alert(response.data.Error);
                } else {
                    const token = response.data.token;
                    localStorage.setItem('staffToken', token);
                    notify();
                }
            });
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <main className='form__container'>
                <form className='form__card form__card--forgetpassword' onSubmit={handleSubmit}>
                    <h3 className='form__header'>Forget Password</h3>
                    <div className='form__inputBox form__inputBox--username'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Staff_Username: e.target.value })}
                        />
                        <span>Username</span>
                    </div>

                    <div className='form__inputBox form__inputBox--email'>
                        <input
                            type="email"
                            required
                            onChange={(e) => setValues({ ...values, Staff_Email: e.target.value })}
                        />
                        <span>Email</span>
                    </div>

                    <button type="submit" className='form__btn form__btn--forgetpassword'>Submit</button>

                </form>
            </main>
        </div>
    )
}

export default StaffForgetPassword
