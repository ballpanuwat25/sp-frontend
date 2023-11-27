import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function TeacherEditProfile({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherEmail: "",
        teacherUsername: "",
        teacherPassword: "",
    });

    const [Teacher_FName, setTeacher_FName] = useState("");
    const [Teacher_LName, setTeacher_LName] = useState("");
    const [Teacher_Email, setTeacher_Email] = useState("");
    const [Teacher_Username, setTeacher_Username] = useState("");
    const [Teacher_Password, setTeacher_Password] = useState("");
    const [Teacher_Tel, setTeacher_Tel] = useState("");

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherInfo(response.data);
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    useEffect(() => {
        getTeachersById()
    }, [])

    const getTeachersById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/teacher-list/${id}`);
        const teacher = response.data;
        setTeacher_FName(teacher.Teacher_FName);
        setTeacher_LName(teacher.Teacher_LName);
        setTeacher_Email(teacher.Teacher_Email);
        setTeacher_Username(teacher.Teacher_Username);
        setTeacher_Password(teacher.Teacher_Password);
        setTeacher_Tel(teacher.Teacher_Tel);
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('teacherToken');
                navigate("/");
            }
        });
    };

    const { id } = useParams();

    const updateTeacherInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(process.env.REACT_APP_API + `/teacher-list/${id}`, {
                Teacher_FName,
                Teacher_LName,
                Teacher_Email,
                Teacher_Username,
                Teacher_Password,
                Teacher_Tel
            });

            if (response.status === 200) {
                handleLogout();
            } else {
                console.log("Unexpected response:", response);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                notify();
            } else {
                console.log("Error:", err);
            }
        }
    };

    const notify = () => toast.warn("Username already exists");

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to=" teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className="ms-1">Request</div></Link>
                        <Link to=" teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to=" teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to=" teacher-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> <div className='sidebar__item--active'>Profile</div></Link>
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
                            <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={updateTeacherInfo}>
                        <div className='profile__form'>
                            <div className="mb-3">
                                <label htmlFor="Teacher_FName" className='profile__label'>ชื่อจริง</label>
                                <input type="text" className='profile__input' id="Teacher_FName" placeholder="Enter Teacher First Name"
                                    value={Teacher_FName}
                                    onChange={(e) => {
                                        setTeacher_FName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_LName" className='profile__label'>นามสกุล</label>
                                <input type="text" className='profile__input' id="Teacher_LName" placeholder="Enter Teacher Last Name"
                                    value={Teacher_LName}
                                    onChange={(e) => {
                                        setTeacher_LName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_Email" className='profile__label'>Email</label>
                                <input type="text" className='profile__input' id="Teacher_Email" placeholder="Enter Teacher Email"
                                    value={Teacher_Email}
                                    onChange={(e) => {
                                        setTeacher_Email(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Teacher_Username" className='profile__label'>Username</label>
                                <input type="text" className='profile__input' id="Teacher_Username" placeholder="Enter Teacher Username"
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
                                <input type="text" className='profile__input' id="Teacher_Tel" placeholder="Enter Teacher Tel"
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
                    <Link to=" admin-dashboard" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to=" teacher-list" className='footer__item'> <i className="fa-solid fa-users" /></Link>
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

export default TeacherEditProfile
