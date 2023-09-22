import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function TeacherProfile({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
    });

    const [values, setValues] = useState({
        Teacher_Username: "",
        Teacher_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherInfo(response.data);
                    setValues({ ...values, Teacher_Username: response.data.teacherUsername });
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/teacher-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("http://localhost:3001/teacher-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        logout();
                        localStorage.removeItem('teacherToken');
                        navigate("/teacher-login");
                    }
                });
            }
        });
    };

    const handleLogout = () => {
        axios.get("http://localhost:3001/admin-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('adminToken');
                navigate("/");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> Request</Link>
                        <Link to="/teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="/teacher-dashboard/teacher-create-bundle" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/teacher-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> <div className='sidebar__item--active'>Profile</div></Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left' />

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className='profile__label'>Username</label>
                            <input
                                type="text"
                                className='profile__input'
                                placeholder='username'
                                defaultValue={teacherInfo.teacherUsername}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className='profile__label'>New Password</label>
                            <input
                                type="password"
                                className='profile__input'
                                placeholder='password'
                                values={values.Teacher_Password}
                                onChange={(e) => setValues({ ...values, Teacher_Password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="profile__button thai--font">ยืนยันการเปลี่ยนรหัส</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/admin-dashboard" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="/staff-list" className='footer__item'> <i class="fa-solid fa-users" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/admin-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default TeacherProfile
