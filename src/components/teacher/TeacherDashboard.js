import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import ChemicalsBundleList from './teacherCreateBundle/ChemicalsBundleList';
import EquipmentBundleList from './teacherCreateBundle/EquipmentBundleList';

function TeacherDashboard({ logout }) {
    const [teacherUsername, setTeacherUsername] = useState("");

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherUsername(response.data.teacherUsername);
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:3001/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('teacherToken');
                navigate("/");
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
                            <li><Link to="./teacher-create-bundle" className='dropdown-item'>Create Bundle</Link> </li>
                            <li><Link to="./bundle-list" className='dropdown-item'>View Bundle</Link></li>
                        </ul>
                    </div>
                    <Link to="/teacher-profile" className='btn btn-primary me-2'>Profile</Link>
                    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div> <hr />
            <ChemicalsBundleList />
            <EquipmentBundleList />
        </div>
    )
}

export default TeacherDashboard