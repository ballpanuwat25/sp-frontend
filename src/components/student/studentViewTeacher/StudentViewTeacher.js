import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

const StudentViewTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTeachers();
    }, []);

    const getTeachers = async () => {
        const response = await axios.get("https://special-problem.onrender.com/teacher-list");
        setTeachers(response.data);
        setIsLoading(false);
    };

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
        axios.get("https://special-problem.onrender.com/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentInfo(response.data);
            }
        });
    }, []);

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/student-logout").then((response) => {
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

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredTeachers = teachers.filter((teacher) =>
            teacher.Teacher_Id.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Teacher_FName.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Teacher_LName.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredTeachers(filteredTeachers);
    };

    useEffect(() => {
        setFilteredTeachers(teachers);
    }, [teachers]);

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                        <Link to="/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> <div className='sidebar__item--active'>Teacher</div></Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div class="spinner-border text-success" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>
                                    <i className='fa-solid fa-magnifying-glass'></i>
                                    <input
                                        type="search"
                                        className='component__search'
                                        placeholder="ค้นหาด้วยชื่อหรือรหัสอาจารย์"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <div>{user_picture}</div>
                                    <div>{user_email}</div>
                                </div>
                            </div>

                            <div >
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>รายชื่ออาจารย์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">รหัสอาจารย์</th>
                                            <th scope="col">ชื่อ-นามสกุล</th>
                                            <th scope="col">เบอร์โทรศัพท์</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachers.map((teacher) => (
                                            <tr key={teacher.Teacher_Id} className="active-row">
                                                <td> {teacher.Teacher_Id} </td>
                                                <td> {teacher.Teacher_FName} {teacher.Teacher_LName}</td>
                                                <td> {teacher.Teacher_Tel} </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to="/student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentViewTeacher