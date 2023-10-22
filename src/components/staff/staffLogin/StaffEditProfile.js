import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffEditProfile({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffEmail: "",
        staffUsername: "",
        staffPassword: "",
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
                }
            })
            .catch((error) => {
                console.error("Staff Request Failed:", error);
            });
    }, []);

    useEffect(() => {
        getStaffsById()
    }, [])

    const getStaffsById = async () => {
        const response = await axios.get(`https://special-problem.onrender.com/staff-list/${id}`);
        const staff = response.data;
        setStaff_FName(staff.Staff_FName);
        setStaff_LName(staff.Staff_LName);
        setStaff_Email(staff.Staff_Email);
        setStaff_Username(staff.Staff_Username);
        setStaff_Password(staff.Staff_Password);
        setStaff_Tel(staff.Staff_Tel);
    };

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/");
                logout();
            }
        });
    };

    const [Staff_FName, setStaff_FName] = useState("");
    const [Staff_LName, setStaff_LName] = useState("");
    const [Staff_Email, setStaff_Email] = useState("");
    const [Staff_Username, setStaff_Username] = useState("");
    const [Staff_Password, setStaff_Password] = useState("");
    const [Staff_Tel, setStaff_Tel] = useState("");

    const { id } = useParams();

    const updateStaffInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`https://special-problem.onrender.com/staff-list/${id}`, {
                Staff_FName,
                Staff_LName,
                Staff_Email,
                Staff_Username,
                Staff_Password,
                Staff_Tel
            });

            if (response.status === 200) {
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

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <div className='dashboard__container'>
            <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/staff-dashboard/staff-chemicals-receipt" className='sidebar__item sidebar__item--hover'> <i className="me-3 fa-solid fa-receipt"/> Receipt</Link>
<Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" /> Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> <div className='sidebar__item--active'> Profile</div></Link>
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
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={updateStaffInfo}>
                        <div className='profile__form'>
                            <div className="mb-3">
                                <label htmlFor="Staff_FName" className='profile__label'>ชื่อจริง</label>
                                <input type="text" className='profile__input' id="Staff_FName" placeholder="Enter Staff First Name"
                                    value={Staff_FName}
                                    onChange={(e) => {
                                        setStaff_FName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Staff_LName" className='profile__label'>นามสกุล</label>
                                <input type="text" className='profile__input' id="Staff_LName" placeholder="Enter Staff Last Name"
                                    value={Staff_LName}
                                    onChange={(e) => {
                                        setStaff_LName(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Staff_Email" className='profile__label'>Email</label>
                                <input type="text" className='profile__input' id="Staff_Email" placeholder="Enter Staff Email"
                                    value={Staff_Email}
                                    onChange={(e) => {
                                        setStaff_Email(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Staff_Username" className='profile__label'>Username</label>
                                <input type="text" className='profile__input' id="Staff_Username" placeholder="Enter Staff Username"
                                    value={Staff_Username}
                                    onChange={(e) => {
                                        setStaff_Username(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Staff_Password" className='profile__label'>Password</label>
                                <input type="password" className='profile__input' id="Staff_Password" placeholder="Enter Staff Password" required
                                    value={Staff_Password}
                                    onChange={(e) => {
                                        setStaff_Password(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Staff_Tel" className='profile__label'>Tel</label>
                                <input type="text" className='profile__input' id="Staff_Tel" placeholder="Enter Staff Tel" required
                                    value={Staff_Tel}
                                    onChange={(e) => {
                                        setStaff_Tel(e.target.value);
                                    }}
                                />
                            </div>

                            <button type="submit" className="profile__button thai--font">อัพเดตข้อมูล</button>
                        </div>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to="/equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="/chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StaffEditProfile
