import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'

function Home() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const storedUserName = localStorage.getItem('user_name');
        const storedUserEmail = localStorage.getItem('user_email');
        const storedUserPicture = localStorage.getItem('user_picture');

        if (storedUserName && storedUserEmail && storedUserPicture) {
            setUser({
                name: storedUserName,
                email: storedUserEmail,
                picture: storedUserPicture,
            });
        }
    }, []);

    function handleSignOut(event) {
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_picture');
        setUser({});
    }

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Home</h1>
                <div className="dropdown">
                    {/* eslint-disable-next-line */}
                    <a className="btn btn-primary dropdown-toggle me-2" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        Login
                    </a>
                    {Object.keys(user).length !== 0 ? (
                        <button className='btn btn-outline-dark' onClick={(e) => handleSignOut(e)}> Sign Out </button>
                    ) : null}

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><Link className="dropdown-item" to="/admin-login">Admin Login</Link></li>
                        <li><Link className="dropdown-item" to="/staff-login">Staff Login</Link></li>
                        <li><Link className="dropdown-item" to="/teacher-login">Teacher Login</Link> </li>
                        <li><Link className="dropdown-item" to="/student-login">Student Login</Link> </li>
                    </ul>
                </div>
            </div>

            <div className='d-flex justify-content-center align-items-center'>
                <img className='me-3' src={user.picture} />
                <div className='login-text'>
                    <h3>{user.name}</h3>
                    <h5>{user.email}</h5>
                </div>
            </div>
        </div>
    )
}

export default Home