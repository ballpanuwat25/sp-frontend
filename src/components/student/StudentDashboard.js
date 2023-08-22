import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import StudentChemicalsList from './studentChemReq/StudentChemicalsList';
import StudentEquipmentList from './studentEquipmentReq/StudentEquipmentList';

function StudentDashboard() {
    const [studentId, setStudentId] = useState("");
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentPassword, setStudentPassword] = useState("");
    const [studentTel, setStudentTel] = useState("");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:3001/student").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentId(response.data.studentId);
                setStudentFirstName(response.data.studentFirstName);
                setStudentLastName(response.data.studentLastName);
                setStudentEmail(response.data.studentEmail);
                setStudentPassword(response.data.studentPassword);
                setStudentTel(response.data.studentTel);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:3001/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                navigate("/");
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
            }
        });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <nav id='sidebar' className='col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100'>
                    <div className='position-sticky'>
                        <h2>Student Dashboard</h2>
                        <hr />
                        <div>
                            <h5>StudentId: {studentId}</h5>
                            <h5>Name: {studentFirstName} {studentLastName}</h5>
                            <h5>Email: {studentEmail}</h5>
                            <h5>Password: {studentPassword}</h5>
                            <h5>Tel: {studentTel}</h5>
                        </div>
                        <hr />
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle mb-2 w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown button
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link to="./student-chemicals-request" className="dropdown-item">Chemicals Request List</Link></li>
                                <li><Link to="./student-chemicals-cart" className="dropdown-item">Chemicals Cart</Link></li>
                                <li><Link to="./student-equipment-request" className="dropdown-item">Equipment Request List</Link></li>
                                <li><Link to="./student-equipment-cart" className="dropdown-item">Equipment Cart</Link></li>
                                <li><Link to="./bundle-list" className='dropdown-item'>Bundle List</Link> </li>
                            </ul>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Link to="/student-profile" className='btn btn-outline-primary me-2 w-100'>Profile</Link>
                            <button className='btn btn-outline-danger w-100' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </nav>

                <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                    <StudentChemicalsList />
                    <StudentEquipmentList />
                </main>
            </div>
        </div>
    )
}

export default StudentDashboard