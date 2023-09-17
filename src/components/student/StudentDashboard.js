import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import StudentChemicalsList from './studentReq/studentChemReq/StudentChemicalsList';

import '../cssElement/Dashboard.css'
import logo from '../assets/logo.png';

function StudentDashboard() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:3001/student", {
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

    const handleLogout = () => {
        axios.get("http://localhost:3001/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
                localStorage.removeItem('studentToken');
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
                        <div className='sidebar__title std__name'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/student-dashboard" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-house" /> <div className='sidebar__item--active'>Dashboard</div></Link>
                        <Link to="./student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="./bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="./student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="./student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <StudentChemicalsList />
                </main>

                <footer className='footer'>
                    <Link to="/student-dashboard" className='footer__item footer__item--active'><i class="fa-solid fa-house" /></Link>
                    <Link to="./student-chemicals-list" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="./bundle-list" className='footer__item'> <i class="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="./student-chemicals-cart" className='footer__item'> <i class="fa-solid fa-cart-shopping" /></Link>
                    <Link to="./student-chemicals-request" className='footer__item'> <i class="fa-solid fa-clock-rotate-left" /></Link>
                    <Link to="/student-profile" className='footer__item'> <i class="fa-solid fa-user" /></Link>
                </footer>
            </div>
        </div>
    )
}

export default StudentDashboard