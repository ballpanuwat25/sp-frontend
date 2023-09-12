import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

function StaffDashboard({ logout }) {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.get("http://localhost:3001/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('staffToken');
                navigate("/");
            }
        });
    };

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Staff Dashboard</h1>
                <div className='d-flex justify-content-between align-items-center gap-2'>
                    <Link to="/staff-profile" className='btn btn-primary '>Profile</Link>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Requests
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><Link to="./staff-chemicals-request-list" className='dropdown-item'>Chemicals</Link></li>
                            <li><Link to="./staff-equipment-request-list" className='dropdown-item'>Equipment</Link></li>
                        </ul>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Products
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><Link to="/chemicals-list" className='dropdown-item'>Chemicals</Link></li>
                            <li><Link to="/chemicals-stock" className='dropdown-item'>Chemicals Stock</Link></li>
                            <li><Link to="/equipment-list" className='dropdown-item'>Equipment</Link></li>
                        </ul>
                    </div>
                    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div> <hr />
        </div>
    )
}

export default StaffDashboard