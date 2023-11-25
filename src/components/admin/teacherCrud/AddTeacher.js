import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AddTeacher({ logout }) {
    const [teacher, setTeacher] = useState({
        Teacher_Id: "",
        Teacher_FName: "",
        Teacher_LName: "",
        Teacher_Email: "",
        Teacher_Username: "",
        Teacher_Password: "",
        Teacher_Tel: ""
    });

    const saveTeacher = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(process.env.REACT_APP_API + "/teacher-list", teacher);
    
            if (response.status === 201) {
                // Teacher Created successfully, navigate to teacher list
                navigate("/chem/teacher-list");
            } else {
                // Handle other possible responses
                console.log("Unexpected response:", response);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Username already exists, display an error message
                notify();
            } else {
                // Handle other possible errors
                console.log("Error:", err);
            }
        }
    };

    const notify = () => toast.warn("Username already exists");

    const [adminInfo, setAdminInfo] = useState({
        adminUsername: "",
        adminPassword: "",
        adminTel: "",
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
                navigate("/chem");
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
                        <div className='sidebar__title admin__name'>Welcome, {adminInfo.adminUsername}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/chem/admin-dashboard" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> Log Activity</Link>
                        <Link to="/chem/admin-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> <div className='sidebar__item--active'>Users</div></Link>
                        <Link to="/chem/admin-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
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
                                <label htmlFor="Teacher_Email" className='profile__label'>Email</label>
                                <input type="text" className='profile__input' id="Teacher_Email" placeholder="Enter Teacher Email"
                                    onChange={(e) => {
                                        setTeacher({ ...teacher, Teacher_Email: e.target.value });
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
                    <Link to="/chem/admin-dashboard" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/chem/admin-list" className='footer__item'> <i className="fa-solid fa-users" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/chem/admin-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AddTeacher
