import React from 'react'
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Logo</h1>

                <div className='button-group'>
                    <Link to="/student-login" className='btn btn-primary me-2'>Log in</Link>
                    <Link to="/student-register" className='btn btn-primary'>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Header
