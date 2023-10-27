import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

const AdminList = ({ logout }) => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [adminInfo, setAdminInfo] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
        adminTel: "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAdmins, setFilteredAdmins] = useState([]);

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getAdmins();
    }, []);

    useEffect(() => {
        setFilteredAdmins(admins);
    }, [admins]);

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

    const getAdmins = async () => {
        const response = await axios.get("https://special-problem.onrender.com/admin-list");
        setAdmins(response.data);
        setIsLoading(false);
    };

    const deleteAdmin = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/admin-list/${id}`)
            getAdmins();
        } catch (error) {
            console.log(error)
        }
    }

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

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredAdmins = admins.filter((admin) =>
            admin.Admin_Id.toLowerCase().includes(query.toLowerCase()) ||
            admin.Admin_FName.toLowerCase().includes(query.toLowerCase()) ||
            admin.Admin_LName.toLowerCase().includes(query.toLowerCase()) ||
            admin.Admin_Username.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredAdmins(filteredAdmins);
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
                        <Link to="/admin-dashboard" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> Log Activity</Link>
                        <Link to="/admin-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> <div className='sidebar__item--active'>Users</div></Link>
                        <Link to="/admin-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
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
                                        placeholder="ค้นหาด้วยชื่อหรือรหัสผู้ดูแล"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <Link to={`add-admin`} className="search__button add--btn">เพิ่มผู้ดูแล</Link>
                                </div>
                            </div>

                            <div >
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>ผู้ดูแล</Link>
                                    <Link to="/staff-list" className='table__tab table__tab--chemicals table__tab--unactive'>เจ้าหน้าที่</Link>
                                    <Link to="/teacher-list" className='table__tab table__tab--chemicals table__tab--unactive'>อาจารย์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">รหัสผู้ดูแล</th>
                                            <th scope="col">ชื่อ-สกุล</th>
                                            <th scope='col'>Email</th>
                                            <th scope="col">เบอร์โทรศัพท์</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAdmins.map((admin) => (
                                            <tr key={admin.Admin_Id} className="active-row">
                                                <td> {admin.Admin_Id} </td>
                                                <td> {admin.Admin_FName} {admin.Admin_LName}</td>
                                                <td> {admin.Admin_Email} </td>
                                                <td> {admin.Admin_Tel} </td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <Link to={`edit-admin/${admin.Admin_Id}`} className="edit--btn">แก้ไขข้อมูล</Link>
                                                        <button onClick={() => deleteAdmin(admin.Admin_Id)} className="delete--btn btn-danger">ลบผู้ใช้</button>
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
                    <Link to="/admin-dashboard" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/admin-list" className='footer__item'> <i className="fa-solid fa-users" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/admin-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AdminList