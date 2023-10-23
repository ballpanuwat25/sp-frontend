import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function StudentGoogleRegister() {
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
                axios.post("https://special-problem.onrender.com/student-login", values).then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        navigate("/student-login");
                    }
                });
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
        <div className='container-fluid vh-100'>
            <main className='form__container'>
                <form className='form__card form__card--signup' onSubmit={handleSubmit}>
                    <h3 className='form__header'>Information</h3>

                    <div className='form__inputBox form__inputBox--id'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_Id: e.target.value })}
                        />
                        <span>Student Id</span>
                    </div>

                    <div className='form__inputBox form__inputBox--fname'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_FName: e.target.value })}
                        />
                        <span>First Name</span>
                    </div>

                    <div className='form__inputBox form__inputBox--lname'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_LName: e.target.value })}
                        />
                        <span>Last Name</span>
                    </div>

                    <div className='form__inputBox form__inputBox--email'>
                        <input
                            type="text"
                            required
                            defaultValue={user.email}
                        />
                        <span>Email</span>
                    </div>

                    <div className='form__inputBox form__inputBox--password'>
                        <input
                            type="password"
                            required
                            onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
                        />
                        <span>Password</span>
                    </div>

                    <div className='form__inputBox form__inputBox--tel'>
                        <input
                            type="text"
                            required
                            onChange={(e) => setValues({ ...values, Student_Tel: e.target.value })}
                        />
                        <span>Tel</span>
                    </div>

                    <button type="submit" className='form__btn'>Create Account</button>
                    <div className='form__text thai--font'>กรุณาใส่ข้อมูลก่อนเข้าสู่ระบบ</div>
                </form>
            </main>

        </div>
    )
}

export default StudentGoogleRegister
