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

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><Link class="dropdown-item" to="/student-login">Student</Link></li>
                        <li><Link class="dropdown-item" to="/teacher-login">Teacher</Link></li>
                        <li><Link class="dropdown-item" to="/staff-login">Staff</Link></li>
                        <li><Link class="dropdown-item" to="/admin-login">Admin</Link></li>
                    </ul>
                </div>
                <Link to="/student-register" className='header__button header__button--signup '>Sign up</Link>

                <i className="fa-solid fa-bars" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"></i>

                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header d-flex justify-content-end">
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className='d-flex flex-column align-items-center'>
                            <div className='header__links'>
                                <div className='dropdown'>
                                    <button className='header__button--hover dropdown-toggle' type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                        Log in
                                    </button>

                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                        <li><Link class="dropdown-item" to="/student-login">Student</Link></li>
                                        <li><Link class="dropdown-item" to="/teacher-login">Teacher</Link></li>
                                        <li><Link class="dropdown-item" to="/staff-login">Staff</Link></li>
                                        <li><Link class="dropdown-item" to="/admin-login">Admin</Link></li>
                                    </ul>
                                </div>
                            </div>

                            <div className='header__links'>
                                <Link to="/student-register" className='header__link header__button--hover'>Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header