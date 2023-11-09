import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css'

function StudentForgetPassword() {
    const [values, setValues] = useState({
        Student_Email: "",
        Student_Password: "",
    });

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(process.env.REACT_APP_API + "/student-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                const token = response.data.token;
                localStorage.setItem('studentToken', token);
                notify();
            }
        });

        const notify = () => toast.info("Please check your email for the reset link, you can close this tab now");
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <main className='form__container'>
                <form className='form__card form__card--forgetpassword' onSubmit={handleSubmit}>
                    <h3 className='form__header'>Forget Password</h3>
                    <div className='form__inputBox form__inputBox--email'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_Email: e.target.value })}
                        />
                        <span>Email</span>
                    </div>

                    <button type="submit" className='form__btn form__btn--forgetpassword'>Submit</button>
                </form>
            </main>
        </div>
    )
}

export default StudentForgetPassword
