import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import TeacherChemicalsRequest from './teacherManageReq/TeacherChemicalsRequest';

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
                <div>
                    <Link to="/teacher-profile" className='btn btn-primary me-2'>Profile</Link>
                    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div> <hr />

            <TeacherChemicalsRequest />
        </div>
    )
}

export default TeacherDashboard