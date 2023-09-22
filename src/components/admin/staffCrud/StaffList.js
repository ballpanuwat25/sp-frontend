import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

const StaffList = ({ logout }) => {
    const [staffs, setStaffs] = useState([]);

    useEffect(() => {
        getStaffs();
    }, []);

    const getStaffs = async () => {
        const response = await axios.get("http://localhost:3001/staff-list");
        setStaffs(response.data);
    };

    const deleteStaff = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/staff-list/${id}`)
            getStaffs();
        } catch (error) {
            console.log(error)
        }
    }

    const [adminInfo, setAdminInfo] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
        adminTel: "",
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/admin", {
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
        axios.get("http://localhost:3001/admin-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('adminToken');
                navigate("/");
            }
        });
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStaffs, setFilteredStaffs] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredStaffs = staffs.filter((staff) => 
            staff.Staff_Id.toLowerCase().includes(query.toLowerCase()) ||
            staff.Staff_FName.toLowerCase().includes(query.toLowerCase()) ||
            staff.Staff_LName.toLowerCase().includes(query.toLowerCase()) ||
            staff.Staff_Username.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredStaffs(filteredStaffs);
    };

    useEffect(() => {
        setFilteredStaffs(staffs);
    }, [staffs]);

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
                        <div className='component__headerGroup component__headerGroup--left'>
                            <i class='fa-solid fa-magnifying-glass'></i>
                            <input
                                type="search"
                                className='component__search'
                                placeholder="ค้นหาด้วยชื่อหรือรหัสเจ้าหน้าที่"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <Link to={`add-staff`} className="search__button add--btn">เพิ่มเจ้าหน้าที่</Link>
                        </div>
                    </div>

                    <div >
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>เจ้าหน้าที่</Link>
                            <Link to="/teacher-list" className='table__tab table__tab--chemicals table__tab--unactive'>อาจารย์</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Staff Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Password</th>
                                    <th scope="col">Tel</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaffs.map((staff) => (
                                    <tr key={staff.Staff_Id} className="active-row">
                                        <td> {staff.Staff_Id} </td>
                                        <td> {staff.Staff_FName} {staff.Staff_LName}</td>
                                        <td> {staff.Staff_Username} </td>
                                        <td> {staff.Staff_Password} </td>
                                        <td> {staff.Staff_Tel} </td>
                                        <td>
                                            <div className="d-grid gap-2 d-sm-flex">
                                                <Link to={`edit-staff/${staff.Staff_Id}`} className="edit--btn">Edit</Link>
                                                <button onClick={() => deleteStaff(staff.Staff_Id)} className="delete--btn btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

export default StaffList