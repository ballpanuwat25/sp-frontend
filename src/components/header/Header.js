import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'

import logo from '../assets/logo.png';

function Header() {
    return (
        <div className='header d-flex justify-content-between align-items-center mt-4'>
            <img src={logo} alt="logo" className='header__logo' width={69} height={53} />

            <div className='header__buttonsCenter'>
                <Link to="/" className='header__button header__button--hover'>About</Link>
                <Link to="/" className='header__button header__button--hover mx-5'>Contact</Link>
                <Link to="/" className='header__button header__button--hover'>FAQ</Link>
            </div>

            <div className='header__buttonsEnd'>
                <Link to="/student-login" className='header__button header__button--hover me-4'>Log in</Link>
                <Link to="/student-register" className='header__button header__button--signup '>Sign up</Link>
            </div>
        </div>
    )
}

export default Header
