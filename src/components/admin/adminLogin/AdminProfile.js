import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AdminProfile({ logout }) {
    const [adminInfo, setAdminInfo] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
    });

    const [values, setValues] = useState({
        Admin_Username: "",
        Admin_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/admin", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Admin Request Error:", response.data.Error);
                } else {
                    setAdminInfo(response.data);
                    setValues({ ...values, Admin_Username: response.data.adminUsername });
                }
            })
            .catch((error) => {
                console.error("Admin Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/admin-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                notify();
                axios.get("https://special-problem.onrender.com/admin-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        logout();
                        localStorage.removeItem('adminToken');
                        navigate("/admin-login");
                    }
                });
            }
        });
    };

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/admin-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('adminToken');
                navigate("/");
            }
        });
    };

    const notify = () => toast.success("Password changed successfully");

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {adminInfo.adminUsername}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/admin-dashboard" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> Log Activity</Link>
                        <Link to="/staff-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to="/admin-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> <div className='sidebar__item--active'>Profile</div></Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left' />

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{adminInfo.adminUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className='profile__label'>Username</label>
                            <input
                                type="text"
                                className='profile__input'
                                placeholder='username'
                                defaultValue={adminInfo.adminName}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className='profile__label'>New Password</label>
                            <input
                                type="password"
                                className='profile__input'
                                placeholder='new password'
                                values={values.Admin_Password}
                                onChange={(e) => setValues({ ...values, Admin_Password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="profile__button thai--font">ยืนยันการเปลี่ยนรหัส</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/admin-dashboard" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/staff-list" className='footer__item'> <i className="fa-solid fa-users" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/admin-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AdminProfile
