import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../Alert';

import '../../cssElement/Form.css'

function StaffLogin({ login }) {
    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Password: "",
    });
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the username exists
        try {
            const response = await axios.get("https://special-problem.onrender.com/staff-list");
            const staffList = response.data;
            const staff = staffList.find((staff) => staff.Staff_Username === values.Staff_Username);

            if (staff) {
                setUsernameError(""); // Username exists, clear error
            } else {
                setUsernameError("Username does not exist");
                setAlertMessage("Username does not exist"); // Set the message for the custom alert
                setShowAlert(true); // Show the custom alert
                return; // Exit the function early
            }
        } catch (error) {
            console.error("Axios Error:", error);
        }

        // Check if the password is correct
        try {
            const response = await axios.get("https://special-problem.onrender.com/staff-list");
            const staffList = response.data;
            const staff = staffList.find((staff) => staff.Staff_Password === values.Staff_Password);

            if (staff) {
                setPasswordError(""); // Password is correct, clear error
            } else {
                setPasswordError("Password is incorrect");
                setAlertMessage("Password is incorrect"); // Set the message for the custom alert
                setShowAlert(true); // Show the custom alert
                return
            }
        } catch (error) {
            console.error("Axios Error:", error);
        }

        setLoginInProgress(true);

        // If both username and password are valid, proceed with login
        axios.post("https://special-problem.onrender.com/staff-login", values)
            .then((response) => {
                console.log(response.data.Error);
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
            }).finally(() => {
                // Reset login in progress
                setLoginInProgress(false);
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
                            onChange={(e) => setValues({ ...values, Staff_Username: e.target.value })}
                        />
                        <span>Username</span>
                    </div>

                    <div className='form__inputBox form__inputBox--password'>
                        <input
                            type="password"
                            required
                            onChange={(e) => setValues({ ...values, Staff_Password: e.target.value })}
                        />
                        <span>Password</span>
                    </div>

                    <div className='form__forgetPassword'>
                        <Link to="/staff-forget-password" className='forgetPassword__text'>Forgot password</Link>
                    </div>

                    {loginInProgress ? (
                        <div className="loader">Loading...</div>
                    ) : (
                        <button type="submit" className='form__btn'>Login</button>
                    )}

                    {showAlert && (
                        <Alert
                            message={alertMessage}
                            onClose={() => setShowAlert(false)}
                        />
                    )}
                </form>
            </main>
        </div>
    )
}

export default StaffLogin