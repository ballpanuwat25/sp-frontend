import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherForgetPassword() {
    const [values, setValues] = useState({
        Teacher_Username: "",
        Teacher_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post("https://special-problem.onrender.com/teacher-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                navigate("/teacher-login");
            }
        });
    };

    return (
        <div className='container-fluid'>
            <h1>Teacher Forget Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        onChange={(e) => setValues({ ...values, Teacher_Username: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        onChange={(e) => setValues({ ...values, Teacher_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default TeacherForgetPassword
