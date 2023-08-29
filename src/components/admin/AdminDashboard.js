import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function AdminDashboard({ logout }) {
    const [adminName, setAdminName] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminTel, setAdminTel] = useState("");

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:3001/admin").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setAdminName(response.data.adminName);
                setAdminUsername(response.data.adminUsername);
                setAdminPassword(response.data.adminPassword);
                setAdminTel(response.data.adminTel);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:3001/admin-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                window.location.href = "/";
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
                        {/* eslint-disable-next-line */}
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

            <h5>AdminName: {adminName}</h5>
            <h5>AdminUsername: {adminUsername}</h5>
            <h5>AdminPassword: {adminPassword}</h5>
            <h5>AdminTel: {adminTel}</h5>
        </div>
    )
}

export default AdminDashboard
