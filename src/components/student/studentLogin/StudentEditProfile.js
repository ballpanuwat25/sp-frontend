import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StudentEditProfile({ logout }) {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const [Student_FName, setStudent_FName] = useState("");
    const [Student_LName, setStudent_LName] = useState("");
    const [Student_Email, setStudent_Email] = useState("");
    const [Student_Password, setStudent_Password] = useState("");
    const [Student_Tel, setStudent_Tel] = useState("");

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Student Request Error:", response.data.Error);
                } else {
                    setStudentInfo(response.data);
                }
            })
            .catch((error) => {
                console.error("Student Request Failed:", error);
            });
    }, []);

    useEffect(() => {
        getStudentsById()
    }, [])

    const { id } = useParams();

    const getStudentsById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/student-list/${id}`);
        const student = response.data;
        setStudent_FName(student.Student_FName);
        setStudent_LName(student.Student_LName);
        setStudent_Email(student.Student_Email);
        setStudent_Password(student.Student_Password);
        setStudent_Tel(student.Student_Tel);
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('studentToken');
                navigate("/chem");
                logout();
            }
        });
    };

    const updateStudentInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(process.env.REACT_APP_API + `/student-list/${id}`, {
                Student_FName,
                Student_LName,
                Student_Email,
                Student_Password,
                Student_Tel,
            });

            if (response.status === 200) {
                handleLogout();
            } else {
                console.log("Unexpected response:", response);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.warn("Email already exists");
            } else {
                console.log("Error:", err);
            }
        }
    };

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

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
                        <Link to="/chem/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/chem/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/chem/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="/chem/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/chem/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> <div className='sidebar__item--active'>Profile</div></Link>
                        <Link to="/chem/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Student</Link>
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

                    <form onSubmit={updateStudentInfo}>
                        <div className='profile__form'>
                            <div className="mb-3">
                                <label htmlFor="Student_FName" className='profile__label'>ชื่อจริง</label>
                                <input type="text" className='profile__input' id="Student_FName" placeholder="Enter Student First Name"
                                    value={Student_FName}
                                    onChange={(e) => {
                                        setStudent_FName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Student_LName" className='profile__label'>นามสกุล</label>
                                <input type="text" className='profile__input' id="Student_LName" placeholder="Enter Student Last Name"
                                    value={Student_LName}
                                    onChange={(e) => {
                                        setStudent_LName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Student_Email" className='profile__label'>Email</label>
                                <input type="text" className='profile__input' id="Student_Email" placeholder="Enter Student Email"
                                    value={Student_Email}
                                    onChange={(e) => {
                                        setStudent_Email(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Student_Password" className='profile__label'>Password</label>
                                <input type="password" className='profile__input' id="Student_Password" placeholder="Enter Student Password" required
                                    value={Student_Password}
                                    onChange={(e) => {
                                        setStudent_Password(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Student_Tel" className='profile__label'>Tel</label>
                                <input type="text" className='profile__input' id="Student_Tel" placeholder="Enter Student Tel"
                                    value={Student_Tel}
                                    onChange={(e) => {
                                        setStudent_Tel(e.target.value);
                                    }}
                                />
                            </div>

                            <button type="submit" className="profile__button thai--font">อัพเดตข้อมูล</button>
                        </div>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/chem/student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/chem/student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/chem/student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/chem/student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/chem/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/chem/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentEditProfile