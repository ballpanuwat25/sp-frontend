import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StudentProfile() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
    });

    const [values, setValues] = useState({
        Student_Email: "",
        Student_Password: "",
    });

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Student Request Error:", response.data.Error);
                } else {
                    setStudentInfo(response.data);
                    setValues({ ...values, Student_Email: response.data.studentEmail });
                }
            })
            .catch((error) => {
                console.error("Student Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/student-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                notify();
                axios.get("https://special-problem.onrender.com/student-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        localStorage.removeItem('studentToken');
                        navigate("/student-login");
                    }
                });
            }
        });
    };

    const notify = () => toast.success("Password changed successfully");

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
                localStorage.removeItem('studentToken');
                navigate("/");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name thai--font'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> <div className='sidebar__item--active'>Profile</div></Link>
                        <Link to="/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left' />

                        <div className='component__headerGroup component__headerGroup--right'>
                            <div>{user_picture}</div>
                            <div>{user_email}</div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='profile__form'>
                            <label className='profile__label'>รหัสนิสิต:</label>
                            <input
                                type="text"
                                readOnly
                                className='profile__input profile__input--readonly'
                                placeholder='studentid'
                                defaultValue={studentInfo.studentId}
                            />
                        </div>

                        <div className='profile__form'>
                            <label className='profile__label'>ชื่อ:</label> <br />
                            <input
                                type="text"
                                readOnly
                                className='profile__input profile__input--readonly'
                                placeholder='firstname'
                                defaultValue={studentInfo.studentFirstName}
                            />
                        </div>

                        <div className='profile__form'>
                            <label className='profile__label'>นามสกุล:</label> <br />
                            <input
                                type="text"
                                readOnly
                                className='profile__input profile__input--readonly'
                                placeholder='lastname'
                                defaultValue={studentInfo.studentLastName}
                            />
                        </div>

                        <div className='profile__form'>
                            <label className='profile__label'>Email:</label> <br />
                            <input
                                type="text"
                                readOnly
                                className='profile__input profile__input--readonly'
                                placeholder='email'
                                defaultValue={studentInfo.studentEmail}
                            />
                        </div>

                        <div className='profile__form'>
                            <label className='profile__label'>รหัสผ่านใหม่:</label>
                            <input
                                type="password"
                                className='profile__input'
                                placeholder='new password'
                                values={values.Student_Password}
                                onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="profile__button">Submit</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentProfile
