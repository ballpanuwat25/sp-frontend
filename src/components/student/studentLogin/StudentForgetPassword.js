import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentForgetPassword() {
    const [values, setValues] = useState({
        Student_Email: "",
        Student_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post("http://localhost:3001/student-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                navigate("/student-login");
            }
        });
    };

    return (
        <div className='container-fluid'>
            <h1>Student Forget Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='email'
                        onChange={(e) => setValues({ ...values, Student_Email: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default StudentForgetPassword
