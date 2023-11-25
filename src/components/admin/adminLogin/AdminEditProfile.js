import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../../assets/logo.png';

function AdminEditProfile({ logout }) {
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

    const [Admin_FName, setAdmin_FName] = useState("");
    const [Admin_LName, setAdmin_LName] = useState("");
    const [Admin_Email, setAdmin_Email] = useState(""); 
    const [Admin_Username, setAdmin_Username] = useState("");
    const [Admin_Password, setAdmin_Password] = useState("");
    const [Admin_Tel, setAdmin_Tel] = useState("");

    const { id } = useParams();

    useEffect(() => {
        getAdminsById()
    }, [])

    const getAdminsById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/admin-list/${id}`);
        const admin = response.data;
        setAdmin_FName(admin.Admin_FName);
        setAdmin_LName(admin.Admin_LName);
        setAdmin_Email(admin.Admin_Email);
        setAdmin_Username(admin.Admin_Username);
        setAdmin_Password(admin.Admin_Password);
        setAdmin_Tel(admin.Admin_Tel);
    };

    const updateAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(process.env.REACT_APP_API + `/admin-list/${id}`, {
                Admin_FName,
                Admin_LName,
                Admin_Username,
                Admin_Email,
                Admin_Password,
                Admin_Tel
            });

            if (response.status === 200) {
                // Admin Updated successfully, navigate to admin list
                handleLogout();
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

                    <form onSubmit={updateAdmin}>
                        <div className='profile__form'>
                            <div className="mb-3">
                                <label htmlFor="Admin_FName" className='profile__label'>ชื่อจริง</label>
                                <input type="text" className='profile__input' id="Admin_FName" placeholder="Enter Admin First Name"
                                    value={Admin_FName}
                                    onChange={(e) => {
                                        setAdmin_FName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Admin_LName" className='profile__label'>นามสกุล</label>
                                <input type="text" className='profile__input' id="Admin_LName" placeholder="Enter Admin Last Name"
                                    value={Admin_LName}
                                    onChange={(e) => {
                                        setAdmin_LName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Admin_Email" className='profile__label'>Email</label>
                                <input type="text" className='profile__input' id="Admin_Email" placeholder="Enter Admin Email"
                                    value={Admin_Email}
                                    onChange={(e) => {
                                        setAdmin_Email(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Admin_Username" className='profile__label'>Username</label>
                                <input type="text" className='profile__input' id="Admin_Username" placeholder="Enter Admin Username" required
                                    value={Admin_Username}
                                    onChange={(e) => {
                                        setAdmin_Username(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Admin_Password" className='profile__label'>Password</label>
                                <input type="password" className='profile__input' id="Admin_Password" placeholder="Enter Admin Password" required
                                    value={Admin_Password}
                                    onChange={(e) => {
                                        setAdmin_Password(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Admin_Tel" className='profile__label'>Tel</label>
                                <input type="text" className='profile__input' id="Admin_Tel" placeholder="Enter Admin Tel" required
                                    value={Admin_Tel}
                                    onChange={(e) => {
                                        setAdmin_Tel(e.target.value);
                                    }}
                                />
                            </div>

                            <button type="submit" className="profile__button thai--font">อัพเดตข้อมูล</button>
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

export default AdminEditProfile