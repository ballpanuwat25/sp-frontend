import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css';

function AdminLogin({ login }) {
    const [values, setValues] = useState({
        Admin_Username: '',
        Admin_Password: '',
    });
    const [usernameError, setUsernameError] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the username exists
        try {
            const response = await axios.get(process.env.REACT_APP_API + "/admin-list");
            const adminList = response.data;
            const admin = adminList.find((admin) => admin.Admin_Username === values.Admin_Username);

            if (admin) {
                setUsernameError(''); // Username exists, clear error
            } else {
                setUsernameError('Username does not exist');
                notifyUsername()
                return; // Exit the function early
            }
        } catch (error) {
            console.error('Axios Error:', error);
        }

        setLoginInProgress(true);

        // If both username and password are valid, proceed with login
        axios
            .post(process.env.REACT_APP_API + "/admin-login", values)
            .then((response) => {
                console.log(response.data.Error);
                if (response.data.Error) {
                    console.log(response.data.Error);
                } else {
                    const token = response.data.token;
                    localStorage.setItem('adminToken', token);
                    login();
                    navigate('/chem/admin-dashboard');
                }
            })
            .catch((error) => {
                console.error('Axios Error:', error);
                notifyPassword();
            })
            .finally(() => {
                // Reset login in progress
                setLoginInProgress(false);
            });
    };

    const notifyPassword = () => toast.error("Incorrect password");
    const notifyUsername = () => toast.error("Username does not exist");

    return (
        <div className="container-fluid vh-100">
            <ToastContainer />
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
                        <Link to="/chem/admin-forget-password" className="forgetPassword__text">
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
                </form>
            </main>
        </div>
    );
}

export default AdminLogin;
