import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function TeacherDashboard() {
    const [teacherUsername, setTeacherUsername] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherUsername(response.data.teacherUsername);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:3001/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                window.location.href = "/";
            }
        });
    };

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Teacher Dashboard - Welcome {teacherUsername}</h1>
                <div className='d-flex justify-content-between align-items-center'>
                    <div className="dropdown me-2">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Products
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><Link to="./teacher-chemicals-request" className='dropdown-item'>Chemicals Request</Link></li>
                            <li><Link to="./teacher-equipment-request" className='dropdown-item'>Equipment Request</Link></li>
                        </ul>
                    </div>
                    <Link to="/teacher-profile" className='btn btn-primary me-2'>Profile</Link>
                    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div> <hr />
        </div>
    )
}

export default TeacherDashboard