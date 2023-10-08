import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../cssElement/Form.css'

function AdminForgetPassword() {
    const [values, setValues] = useState({
        Admin_Username: "",
        Admin_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("https://special-problem.onrender.com/admin-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                navigate("/admin-login");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <main className='form__container'>
                <form className='form__card form__card--forgetpassword' onSubmit={handleSubmit}>
                    <h3 className='form__header'>Forget Password</h3>
                    <div className='form__inputBox form__inputBox--username'>
                        <input
                            required
                            onChange={(e) => setValues({ ...values, Admin_Username: e.target.value })}
                        />
                        <span>Username</span>
                    </div>

                    <div className='form__inputBox form__inputBox--password'>
                        <input
                            type="password"
                            required
                            onChange={(e) => setValues({ ...values, Admin_Password: e.target.value })}
                        />
                        <span>Password</span>
                    </div>

                    <button type="submit" className='form__btn form__btn--forgetpassword'>Submit</button>
                </form>
            </main>
        </div>
    )
}

export default AdminForgetPassword