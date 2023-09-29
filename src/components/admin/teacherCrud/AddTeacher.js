import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AddTeacher({ logout }) {
    const [teacher, setTeacher] = useState({
        Teacher_Id: "",
        Teacher_FName: "",
        Teacher_LName: "",
        Teacher_Username: "",
        Teacher_Password: "",
        Teacher_Tel: ""
    });

    const saveTeacher = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://special-problem.onrender.com/teacher-list", (teacher));
            navigate("/teacher-list");
        } catch (err) {
            console.log(err);
        }
    };

    const [adminInfo, setAdminInfo] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
        adminTel: "",
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
                }
            })
            .catch((error) => {
                console.error("Admin Request Failed:", error);
            });
    }, []);

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

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {adminInfo.adminUsername}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/admin-dashboard" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> Log Activity</Link>
                        <Link to="/staff-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-users" /> <div className='sidebar__item--active'>Users</div></Link>
                        <Link to="/admin-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
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
                            <div className='username--text thai--font'>{adminInfo.adminUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={saveTeacher}>
                        <div className='profile__form'>
                            <div className='mb-3'>
                                <label htmlFor="Teacher_Id" className='profile__label'>รหัสอาจารย์*</label>
                                <input type="text" className='profile__input' id="Teacher_Id" placeholder="Teacher Id" required
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_Id: e.target.value });
                                    }}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="Teacher_FName" className='profile__label'>ชื่อจริง</label>
                                <input type="text" className='profile__input' id="Teacher_FName" placeholder="Enter Teacher First Name"
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_FName: e.target.value });
                                    }}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="Teacher_LName" className='profile__label'>นามสกุล</label>
                                <input type="text" className='profile__input' id="Teacher_LName" placeholder="Enter Teacher Last Name"
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_LName: e.target.value });
                                    }}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="Teacher_Username" className='profile__label'>Username*</label>
                                <input type="text" className='profile__input' id="Teacher_Username" placeholder="Enter Teacher Username" required
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_Username: e.target.value });
                                    }}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="Teacher_Password" className='profile__label'>Password*</label>
                                <input type="password" className='profile__input' id="Teacher_Password" placeholder="Enter Teacher Password" required
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_Password: e.target.value });
                                    }}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="Teacher_Tel" className='profile__label'>Tel</label>
                                <input type="text" className='profile__input' id="Teacher_Tel" placeholder="Enter Teacher Tel"
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_Tel: e.target.value });
                                    }}
                                />
                            </div>

                            <button type="submit" className="profile__button thai--font">ยืนยัน</button>
                        </div>
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

export default AddTeacher
