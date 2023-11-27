import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'

import logo from '../assets/logo.png';

function Header() {
    return (
        <div className='header d-flex justify-content-between align-items-center mt-4 mb-4'>
            <img src={logo} alt="logo" className='header__logo' width={69} height={53} />

            <div className='header__buttonsEnd d-flex'>
                <div className='dropdown'>
                    <button className='header__button header__button--hover me-4 dropdown-toggle' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Log in
                    </button>

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><Link className="dropdown-item" to=" student-login">Student</Link></li>
                        <li><Link className="dropdown-item" to=" teacher-login">Teacher</Link></li>
                        <li><Link className="dropdown-item" to=" staff-login">Staff</Link></li>
                        <li><Link className="dropdown-item" to=" admin-login">Admin</Link></li>
                    </ul>
                </div>
                <Link to=" student-register" className='header__button header__button--signup '>Sign up</Link>
            </div>
        </div>
    )
}

export default Header