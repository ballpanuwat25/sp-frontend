import { Link } from 'react-router-dom';
import React from 'react'

function Home() {
    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Home</h1>
                <div className="dropdown">
                    <a className="btn btn-primary dropdown-toggle me-2" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        Login
                    </a>

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><Link className="dropdown-item" to="/admin-login">Admin Login</Link></li>
                        <li><Link className="dropdown-item" to="/staff-login">Staff Login</Link></li>
                        <li><Link className="dropdown-item" to="/teacher-login">Teacher Login</Link> </li>
                        <li><Link className="dropdown-item" to="/student-login">Student Login</Link> </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default Home