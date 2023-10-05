import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../Alert'; // Import your custom alert component

import '../../cssElement/Form.css';

function AdminLogin({ login }) {
    const [values, setValues] = useState({
        Admin_Username: '',
        Admin_Password: '',
    });
    const [usernameError, setUsernameError] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert
    const [alertMessage, setAlertMessage] = useState(''); // Message for the custom alert
    const [loginInProgress, setLoginInProgress] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the username exists
        try {
            const response = await axios.get('https://special-problem.onrender.com/admin-list');
            const adminList = response.data;
            const admin = adminList.find((admin) => admin.Admin_Username === values.Admin_Username);

            if (admin) {
                setUsernameError(''); // Username exists, clear error
            } else {
                setUsernameError('Username does not exist');
                setAlertMessage('Username does not exist'); // Set the message for the custom alert
                setShowAlert(true); // Show the custom alert
                return; // Exit the function early
            }
        } catch (error) {
            console.error('Axios Error:', error);
        }

        setLoginInProgress(true);

        // If both username and password are valid, proceed with login
        axios
            .post('https://special-problem.onrender.com/admin-login', values)
            .then((response) => {
                console.log(response.data.Error);
                if (response.data.Error) {
                    console.log(response.data.Error);
                } else {
                    const token = response.data.token;
                    localStorage.setItem('adminToken', token);
                    login();
                    navigate('/admin-dashboard');
                }
            })
            .catch((error) => {
                console.error('Axios Error:', error);
                setAlertMessage('Incorrect password'); // Set the message for the custom alert
                setShowAlert(true); // Show the custom alert
            })
            .finally(() => {
                // Reset login in progress
                setLoginInProgress(false);
            });
    };

    return (
        <div className="container-fluid vh-100">
            <main className="form__container">
                <form className="form__card form__card--adminlogin" onSubmit={handleSubmit}>
                    <h3 className="form__header">Admin Login</h3>
                    <div className="form__inputBox form__inputBox--username">
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Admin_Username: e.target.value })}
                        />
                        <span>Username</span>
                    </div>

                    <div className="form__inputBox form__inputBox--password">
                        <input
                            type="password"
                            required
                            onChange={(e) => setValues({ ...values, Admin_Password: e.target.value })}
                        />
                        <span>Password</span>
                    </div>

                    <div className="form__forgetPassword">
                        <Link to="/admin-forget-password" className="forgetPassword__text">
                            Forgot password
                        </Link>
                    </div>

                    {loginInProgress ? (
                        <div className="loader">Loading...</div>
                    ) : (
                        <button type="submit" className="form__btn">
                            Login
                        </button>
                    )}

                    {showAlert && (
                        <Alert
                            message={alertMessage}
                            onClose={() => setShowAlert(false)} // Function to hide the custom alert
                        />
                    )}
                </form>
            </main>
        </div>
    );
}

export default AdminLogin;
