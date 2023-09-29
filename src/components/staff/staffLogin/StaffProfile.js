import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffProfile({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
    });

    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Staff Request Error:", response.data.Error);
                } else {
                    setStaffInfo(response.data);
                    setValues({ ...values, Staff_Username: response.data.staffUsername });
                }
            })
            .catch((error) => {
                console.error("Staff Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/staff-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("https://special-problem.onrender.com/staff-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        logout();
                        localStorage.removeItem('staffToken');
                        navigate("/staff-login");
                    }
                });
            }
        });
    };

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffInfo(response.data);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
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
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-toolbox" /> Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-user" /> <div className='sidebar__item--active'> Profile</div></Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="profile__label">Username</label>
                            <input
                                type="text"
                                className="profile__input"
                                placeholder='username'
                                defaultValue={staffInfo.staffUsername}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="profile__label">Password</label>
                            <input
                                type="password"
                                className="profile__input"
                                placeholder='password'
                                values={values.Staff_Password}
                                onChange={(e) => setValues({ ...values, Staff_Password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">ยืนยัน</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i class="fa-regular fa-clock" /></Link>
                    <Link to="/chemicals-list" className='footer__item'> <i class="fa-solid fa-flask" /> </Link>
                    <Link to="/equipment-list" className='footer__item'> <i class="fa-solid fa-toolbox" /></Link>
                    <Link to="/chemicals-stock" className='footer__item'> <i class="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/staff-profile" className='footer__item'> <i class="fa-regular fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StaffProfile
