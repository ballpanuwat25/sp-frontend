import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Form.css'

function StaffLogin({ login }) {
    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Password: "",
    });
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const usernameExists = async (username) => {
        try {
            const response = await axios.get("http://localhost:3001/staff-list");
            const staffList = response.data;
            const staff = staffList.find((staff) => staff.Staff_Username === username);

            if (staff) {
                setUsernameError(""); // Username exists, clear error
            } else {
                setUsernameError("Username does not exist");
            }
        } catch (error) {
            console.error("Axios Error:", error);
        }
    };

    const passwordInCorrect = async (password) => {
        try {
            const response = await axios.get("http://localhost:3001/staff-list");
            const staffList = response.data;
            const staff = staffList.find((staff) => staff.Staff_Password === password);

            if (staff) {
                setPasswordError(""); // Password is correct, clear error
            } else {
                setPasswordError("Password is incorrect");
            }
        } catch (error) {
            console.error("Axios Error:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (usernameError) {
            alert(usernameError);
            return;
        } else if (passwordError) {
            alert(passwordError);
            return;
        }

        axios.post("http://localhost:3001/staff-login", values)
            .then((response) => {
                console.log(response);
                if (response.data.Error) {
                    alert(response.data.Error);
                } else {
                    const token = response.data.token;
                    localStorage.setItem("staffToken", token);
                    login();
                    navigate("/staff-dashboard");
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
                    <h3 className='form__header'>Staff Login</h3>
                    <div className='form__inputBox form__inputBox--username'>
                        <input
                            type="text"
                            required
                            onBlur={(e) => usernameExists(e.target.value)} // Check on blur
                            onChange={(e) => setValues({ ...values, Staff_Username: e.target.value })}
                        />
                        <span>Username</span>
                    </div>

                    <div className='form__inputBox form__inputBox--password'>
                        <input
                            type="password"
                            required
                            onBlur={(e) => passwordInCorrect(e.target.value)} // Check on blur
                            onChange={(e) => setValues({ ...values, Staff_Password: e.target.value })}
                        />
                        <span>Password</span>
                    </div>

                    <div className='form__forgetPassword'>
                        <Link to="/staff-forget-password" className='forgetPassword__text'>Forgot password</Link>
                    </div>

                    <button type="submit" className='form__btn'>Login</button>
                </form>
            </main>
        </div>
    )
}

export default StaffLogin