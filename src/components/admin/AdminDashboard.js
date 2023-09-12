import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function AdminDashboard({ logout }) {
    const [adminInfo, setAdminInfo] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
        adminTel: "",
    });

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

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

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Admin Dashboard</h1>
                <div className='d-flex justify-content-between align-items-center'>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                    <Link to="/admin-profile" className='btn btn-primary ms-2 me-2'>Profile</Link>
                    <div className="dropdown">
                        <button className="btn btn-outline-primary dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            User Mangement
                        </button>

                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li><Link className="dropdown-item" to="/staff-list">Staff List</Link></li>
                            <li><Link className="dropdown-item" to="/teacher-list">Teacher List</Link> </li>
                            <li><Link className="dropdown-item" to="/log-activity">Log Activity</Link> </li>
                        </ul>
                    </div>
                </div>
            </div> <hr />

            <h5>AdminName: {adminInfo.adminName}</h5>
            <h5>AdminUsername: {adminInfo.adminUsername}</h5>
            <h5>AdminPassword: {adminInfo.adminPassword}</h5>
            <h5>AdminTel: {adminInfo.adminTel}</h5>
        </div>
    )

}

export default AdminDashboard
