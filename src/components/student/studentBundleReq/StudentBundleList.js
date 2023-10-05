import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StudentBundleList() {
    const [bundleList, setBundleList] = useState([]);
    const [filteredBundleList, setFilteredBundleList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getBundleList();
    }, []);

    useEffect(() => {
        setFilteredBundleList(bundleList);
    }, [bundleList]);

    const getBundleList = async () => {
        const response = await axios.get("https://special-problem.onrender.com/bundle-list");
        setBundleList(response.data);
    }

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                (bundle.Bundle_Name.toLowerCase().includes(query.toLowerCase()) || query === "")
            );
        });

        setFilteredBundleList(filteredBundleList);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = `${d.getMonth() + 1}`;
        let day = `${d.getDate()}`;
        const year = `${d.getFullYear()}`;

        if (month.length < 2) {
            month = `0${month}`;
        }

        if (day.length < 2) {
            day = `0${day}`;
        }

        return [day, month, year].join("-");
    };

    function processBundleData(bundleList) {
        const uniqueBundleNames = {};
        const processedBundleList = [];

        bundleList.forEach((bundle) => {
            const { Bundle_Id, Bundle_Name, Bundle_Description, Teacher_Id, createdAt } = bundle;

            if (!uniqueBundleNames[Bundle_Name]) {
                uniqueBundleNames[Bundle_Name] = true; // Mark the bundle name as seen
                processedBundleList.push({
                    Bundle_Id,
                    Bundle_Name,
                    Bundle_Description,
                    Teacher_Id,
                    createdAt,
                });
            }
        });

        return processedBundleList;
    }

    const processedBundleList = processBundleData(filteredBundleList);

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

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

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

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        getTeachers();
    }, []);

    const getTeachers = async () => {
        const response = await axios.get("https://special-problem.onrender.com/teacher-list");
        setTeachers(response.data);
    };

    const findTeacherFNameById = (teacherId) => {
        const teacher = teachers.find((teacher) => teacher.Teacher_Id === teacherId);
        return teacher ? teacher.Teacher_FName : "";
    };

    const findTeacherLNameById = (teacherId) => {
        const teacher = teachers.find((teacher) => teacher.Teacher_Id === teacherId);
        return teacher ? teacher.Teacher_LName : "";
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
                        <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> <div className='sidebar__item--active'>Bundle</div></Link>
                        <Link to="/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                        <Link to="/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>
                            <i className='fa-solid fa-magnifying-glass'></i>
                            <input
                                type="search"
                                className='component__search'
                                placeholder="ค้นหาด้วยชื่อ"
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
                            <Link className='table__tab table__tab--chemicals table__tab--active'>กลุ่มสารเคมีและครุภัณฑ์</Link>
                        </div>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>ชื่อ</th>
                                    <th scope='col'>รายละเอียด</th>
                                    <th scope='col'>สร้างโดย</th>
                                    <th scope='col'>สร้างเมื่อ</th>
                                    <th scope='col'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedBundleList.map((bundle, index) => (
                                    <tr key={index} className="active-row">
                                        <th>{index + 1}</th>
                                        <td>{bundle.Bundle_Name}</td>
                                        <td>{bundle.Bundle_Description}</td>
                                        <td>{findTeacherFNameById(bundle.Teacher_Id)} {findTeacherLNameById(bundle.Teacher_Id)}</td>
                                        <td>{formatDate(bundle.createdAt)}</td>
                                        <td>
                                            <Link to={`${bundle.Bundle_Name}`} className='disable--link thai--font'>
                                                <div className="table__button">
                                                    <i className="fa-solid fa-eye"></i>
                                                    ดูรายละเอียด
                                                </div>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
    );
}

export default StudentBundleList
