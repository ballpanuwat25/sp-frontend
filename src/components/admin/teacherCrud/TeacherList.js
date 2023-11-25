import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

const TeacherList = ({ logout }) => {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    const [adminInfo, setAdminInfo] = useState({
        adminUsername: "",
        adminPassword: "",
        adminTel: "",
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getTeachers();
    }, []);

    useEffect(() => {
        setFilteredTeachers(teachers);
    }, [teachers]);

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

    const getTeachers = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/teacher-list");
        setTeachers(response.data);
        setIsLoading(false);
    };

    const deleteTeacher = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/teacher-list/${id}`)
            getTeachers();
        } catch (error) {
            console.log(error)
        }
    }

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

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredTeachers = teachers.filter((teacher) =>
            teacher.Teacher_Id.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Teacher_FName.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Teacher_LName.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Teacher_Username.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredTeachers(filteredTeachers);
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
                        <Link to="/chem/admin-dashboard" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> Log Activity</Link>
                        <Link to="/chem/admin-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> <div className='sidebar__item--active'>Users</div></Link>
                        <Link to="/chem/admin-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
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
                                    <Link to={`add-teacher`} className="search__button add--btn">เพิ่มอาจารย์</Link>
                                </div>
                            </div>

                            <div >
                                <div className='table__tabs'>
                                    <Link to="/chem/admin-list" className='table__tab table__tab--chemicals table__tab--unactive'>ผู้ดูแล</Link>
                                    <Link to="/chem/staff-list" className='table__tab table__tab--chemicals table__tab--unactive'>เจ้าหน้าที่</Link>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>อาจารย์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">รหัสอาจารย์</th>
                                            <th scope="col">ชื่อ-สกุล</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">เบอร์โทรศัพท์</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTeachers.map((teacher) => (
                                            <tr key={teacher.Teacher_Id} className="active-row">
                                                <td> {teacher.Teacher_Id} </td>
                                                <td> {teacher.Teacher_FName} {teacher.Teacher_LName}</td>
                                                <td> {teacher.Teacher_Email} </td>
                                                <td> {teacher.Teacher_Tel} </td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <Link to={`edit-teacher/${teacher.Teacher_Id}`} className="edit--btn">แก้ไขข้อมูล</Link>
                                                        <button onClick={() => deleteTeacher(teacher.Teacher_Id)} className="delete--btn btn-danger">ลบผู้ใช้</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
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

export default TeacherList