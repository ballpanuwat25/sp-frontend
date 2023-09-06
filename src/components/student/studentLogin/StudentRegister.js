import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function StudentRegister() {
    const [user, setUser] = useState({});
    const [values, setValues] = useState({
        Student_Id: "",
        Student_FName: "",
        Student_LName: "",
        Student_Email: "",
        Student_Password: "",
        Student_Tel: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/student-register", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                navigate("/student-login");
            }
        });
    };

    useEffect(() => {
        const storedUserName = localStorage.getItem('user_name');
        const storedUserEmail = localStorage.getItem('user_email');
        const storedUserPicture = localStorage.getItem('user_picture');

        if (storedUserName && storedUserEmail && storedUserPicture) {
            setUser({
                name: storedUserName,
                email: storedUserEmail,
                picture: storedUserPicture,
            });
            setValues({
                Student_Email: storedUserEmail,
            });
        }
    }, []);

    return (
        <div className='container-fluid'>
            <h1>Student Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">Student ID</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='student id'
                        onChange={(e) => setValues({ ...values, Student_Id: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='first name'
                        onChange={(e) => setValues({ ...values, Student_FName: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='last name'
                        onChange={(e) => setValues({ ...values, Student_LName: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='email'
                        defaultValue={user.email}
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

                <div className="mb-3">
                    <label htmlFor="tel" className="form-label">Tel</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='tel'
                        onChange={(e) => setValues({ ...values, Student_Tel: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Create Account</button>
                <div className="btn-group w-100" role="group">
                    <Link to="/student-login" className='btn btn-outline-success w-100'>Login</Link>
                </div>
            </form>
        </div>
    )
}

export default StudentRegister
