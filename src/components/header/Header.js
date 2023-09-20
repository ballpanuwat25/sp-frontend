import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'

import logo from '../assets/logo.png';

function Header() {
    return (
        <div className='header d-flex justify-content-between align-items-center mt-4 mb-4'>
            <img src={logo} alt="logo" className='header__logo' width={69} height={53} />

            <div className='header__buttonsCenter'>
                <Link to="/" className='header__button header__button--hover'>Home</Link>
                <Link to="/" className='header__button header__button--hover mx-5'>About</Link>
                <Link to="/" className='header__button header__button--hover'>Contact</Link>
            </div>

            <div className='header__buttonsEnd'>
                <Link to="/student-login" className='header__button header__button--hover me-4'>Log in</Link>
                <Link to="/student-register" className='header__button header__button--signup '>Sign up</Link>

                <i className="fa-solid fa-bars" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"></i>

                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header d-flex justify-content-end">
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className='d-flex flex-column align-items-center'>
                            <div className='header__links'>
                                <Link to="/" className='header__link header__button--hover mt-3 '>Home</Link>
                            </div>

                            <div className='header__links'>
                                <Link to="/" className='header__link header__button--hover'>About</Link>
                            </div>

                            <div className='header__links'>
                                <Link to="/" className='header__link header__button--hover'>Contact</Link>
                            </div>

                            <div className='header__links'>
                                <Link to="/student-login" className='header__link header__button--hover'>Log in</Link>
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