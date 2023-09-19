import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../../cssElement/Table.css'
import '../../../cssElement/Form.css'
import '../../../cssElement/Dashboard.css'

import logo from '../../../assets/logo.png';

function StudentChemicalsRequest() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [filteredChemicalsReq, setFilteredChemicalsReq] = useState([]);

    const searchInputRef = useRef();

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        const inputValue = searchInputRef.current.value;
        const filteredRequests = chemicalsReq.filter(
            (request) => request.Student_Id.includes(inputValue)
        );
        setFilteredChemicalsReq(filteredRequests);
    }, [chemicalsReq]);

    useEffect(() => {
        axios.get("http://localhost:3001/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentInfo(response.data);
            }
        });
        getChemicalsRequest();
    }, []);

    const getChemicalsRequest = async () => {
        const response = await axios.get("http://localhost:3001/chemicals-request-list");
        setChemicalsReq(response.data);
    };

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i class="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    const handleLogout = () => {
        axios.get("http://localhost:3001/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
                localStorage.removeItem('studentToken');
                navigate("/");
            }
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approve':
                return 'fa-solid fa-circle-check';
            case 'Decline':
                return 'fa-solid fa-circle-xmark';
            case 'Pending':
                return 'fa-regular fa-clock';
            default:
                return ''
        }
    };

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-clock-rotate-left" /> <div className='sidebar__item--active'>History</div></Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>
                            <i class="fa-solid fa-ban"/>
                            <input
                                type="text"
                                readOnly
                                className='component__search'
                                ref={searchInputRef}
                                defaultValue={studentInfo.studentId}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <div>{user_picture}</div>
                            <div>{user_email}</div>
                        </div>
                    </div>

                    <div className='table-responsive'>
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>ประวัติการเบิกสารเคมี</Link>
                            <Link to="/student-dashboard/student-equipment-request" className='table__tab table__tab--equipment table__tab--unactive'>ประวัติการเบิกครุภัณฑ์</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Student Id</th>
                                    <th scope="col">Chem Id</th>
                                    <th scope="col">Chem Bottle Id</th>
                                    <th scope="col">Requested Quantity</th>
                                    <th scope="col">Release Quantity</th>
                                    <th scope="col">Counting Unit</th>
                                    <th scope="col">Staff Id</th>
                                    <th scope="col">Teacher Id</th>
                                    <th scope="col">Request Status</th>
                                    <th scope="col">Request Comment</th>
                                    <th scope="col">Request Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredChemicalsReq.map((chemicalsReq) => (
                                    <tr key={chemicalsReq.Chem_Request_Id} className="active-row">
                                        <td> {chemicalsReq.Student_Id} </td>
                                        <td> {chemicalsReq.Chem_Id} </td>
                                        <td> {chemicalsReq.Chem_Bottle_Id} </td>
                                        <td> {chemicalsReq.Requested_Quantity} </td>
                                        <td> {chemicalsReq.Release_Quantity} </td>
                                        <td> {chemicalsReq.Counting_Unit} </td>
                                        <td> {chemicalsReq.Staff_Id} </td>
                                        <td> {chemicalsReq.Teacher_Id} </td>
                                        <td> <i className={`${getStatusIcon(chemicalsReq.Request_Status)}`} /> {chemicalsReq.Request_Status}</td>
                                        <td> {chemicalsReq.Request_Comment} </td>
                                        <td>{formatDate(chemicalsReq.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <footer className='footer'>
                    <Link to="/student-dashboard/student-chemicals-list" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="/student-dashboard/bundle-list" className='footer__item'> <i class="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/student-dashboard/student-chemicals-cart" className='footer__item'> <i class="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/student-dashboard/student-chemicals-request" className='footer__item'> <i class="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentChemicalsRequest
