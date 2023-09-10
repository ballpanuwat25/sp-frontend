import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function AdminLogin({ login }) {
    const [values, setValues] = useState({
        Admin_Username: "",
        Admin_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://backup-test.onrender.com/admin-login", values)
            .then((response) => {
                console.log(response);
                if (response.data.Error) {
                    alert(response.data.Error);
                } else {
                    const token = response.data.token;
                    localStorage.setItem("adminToken", token);
                    login();
                    navigate("/admin-dashboard");
                }
            })
            .catch((error) => {
                console.error("Axios Error:", error);
            });
    };

    return (
        <div className='container-fluid d-flex justify-content-center align-items-center vh-100'>
            <form className='form-control w-50' onSubmit={handleSubmit}>
                <h3>Admin Login</h3>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        onChange={(e) => setValues({ ...values, Admin_Username: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        onChange={(e) => setValues({ ...values, Admin_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
                <div className="btn-group w-100 mb-2" role="group">
                    <Link to="/admin-register" className='btn btn-outline-success w-100 me-2'>Create Account</Link>
                    <Link to="/admin-forget-password" className='btn btn-outline-warning w-100'>Forgot password</Link>
                </div>
            </form>
        </div>
    )
}

export default AdminLogin