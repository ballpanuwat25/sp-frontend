import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'

import logo from '../assets/logo.png';

function Header() {
    return (
        <div className='header d-flex justify-content-between align-items-center mt-4'>
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
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div>
                            Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header