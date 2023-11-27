import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AdminProfile({ logout }) {
    const [adminInfo, setAdminInfo] = useState({
        adminId: "",
        adminFirstName: "",
        adminLastName: "",
        adminEmail: "",
        adminTel: "",
        adminUsername: "",
        adminPassword: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/admin", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Admin Request Error:", response.data.Error);
                } else {
                    setAdminInfo(response.data);
                }
            })
            .catch((error) => {
                console.error("Admin Request Failed:", error);
            });
    }, []);

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/admin-logout").then((response) => {
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
                        <div className='sidebar__title admin__name'>Welcome, {adminInfo.adminUsername}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to=" admin-dashboard" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> Log Activity</Link>
                        <Link to=" admin-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to=" admin-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> <div className='sidebar__item--active'>Profile</div></Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{adminInfo.adminUsername}</div>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <p className="profile__label">รหัสผู้ดูแล: {adminInfo.adminId}</p>
                        <p className="profile__label">ชื่อผู้ใช้: {adminInfo.adminUsername}</p>
                        <p className="profile__label">ชื่อ: {adminInfo.adminFirstName}</p>
                        <p className="profile__label">นามสกุล: {adminInfo.adminLastName}</p>
                        <p className="profile__label">อีเมล: {adminInfo.adminEmail}</p>
                        <p className="profile__label">เบอร์โทรศัพท์: {adminInfo.adminTel}</p>
                        <Link to={` admin-profile/${adminInfo.adminId}`} className='btn edit--btn thai--font'>แก้ไขข้อมูล</Link>
                    </div>
                </main>

                <footer className='footer'>
                    <Link to=" admin-dashboard" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to=" admin-list" className='footer__item'> <i className="fa-solid fa-users" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to=" admin-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AdminProfile
