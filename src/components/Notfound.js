import React from 'react'
import { useNavigate } from 'react-router-dom'

import './cssElement/Dashboard.css'
import './cssElement/Form.css'
import './cssElement/Table.css'

function Notfound() {

    const navigate = useNavigate();
    
    const backToHome = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('staffToken');
        localStorage.removeItem('studentToken');

        localStorage.removeItem('adminIsLoggedIn');
        localStorage.removeItem('teacherIsLoggedIn');
        localStorage.removeItem('staffIsLoggedIn');
        localStorage.removeItem('studentIsLoggedIn');
        navigate("/chem");
        window.location.reload();
    }

    return (
        <div className='container-fluid vh-100 d-flex flex-column justify-content-center align-items-center'>
            <h1 className='mb-3'>404 Not Found</h1>
            <button onClick={backToHome} className='thai--font btn edit--btn'>กลับสู่หน้าหลัก</button>
        </div>
    )
}

export default Notfound
