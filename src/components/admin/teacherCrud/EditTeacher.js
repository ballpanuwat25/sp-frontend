import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EditTeacher({ logout }) {
    const [Teacher_FName, setTeacher_FName] = useState("");
    const [Teacher_LName, setTeacher_LName] = useState("");
    const [Teacher_Username, setTeacher_Username] = useState("");
    const [Teacher_Password, setTeacher_Password] = useState("");
    const [Teacher_Tel, setTeacher_Tel] = useState("");

    const { id } = useParams();

    useEffect(() => {
        getTeachersById()
        // eslint-disable-next-line
    }, [])

    const getTeachersById = async () => {
        const response = await axios.get(`https://special-problem.onrender.com/teacher-list/${id}`);
        const teacher = response.data;
        setTeacher_FName(teacher.Teacher_FName);
        setTeacher_LName(teacher.Teacher_LName);
        setTeacher_Username(teacher.Teacher_Username);
        setTeacher_Password(teacher.Teacher_Password);
        setTeacher_Tel(teacher.Teacher_Tel);
    };

    const updateTeacher = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`https://special-problem.onrender.com/teacher-list/${id}`, {
            Teacher_FName,
            Teacher_LName,
            Teacher_Username,
            Teacher_Password,
            Teacher_Tel
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/teacher-list");
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

                    <form onSubmit={updateTeacher}>
                        <div className='profile__form'>
                            <div className="mb-3">
                                <label htmlFor="Teacher_FName" className='profile__label'>ชื่อจริง</label>
                                <input type="text" className='profile__input' id="Teacher_FName" placeholder="Enter Teacher First Name" required
                                    value={Teacher_FName}
                                    onChange={(e) => {
                                        setTeacher_FName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_LName" className='profile__label'>นามสกุล</label>
                                <input type="text" className='profile__input' id="Teacher_LName" placeholder="Enter Teacher Last Name" required
                                    value={Teacher_LName}
                                    onChange={(e) => {
                                        setTeacher_LName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_Username" className='profile__label'>Username</label>
                                <input type="text" className='profile__input' id="Teacher_Username" placeholder="Enter Teacher Username" required
                                    value={Teacher_Username}
                                    onChange={(e) => {
                                        setTeacher_Username(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_Password" className='profile__label'>Password</label>
                                <input type="password" className='profile__input' id="Teacher_Password" placeholder="Enter Teacher Password" required
                                    value={Teacher_Password}
                                    onChange={(e) => {
                                        setTeacher_Password(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_Tel" className='profile__label'>Tel</label>
                                <input type="text" className='profile__input' id="Teacher_Tel" placeholder="Enter Teacher Tel" required
                                    value={Teacher_Tel}
                                    onChange={(e) => {
                                        setTeacher_Tel(e.target.value);
                                    }}
                                />
                            </div>

                            <button type="submit" className="profile__button thai--font">อัพเดตข้อมูล</button>
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

export default EditTeacher
