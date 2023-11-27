import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../../cssElement/Table.css'
import '../../../cssElement/Form.css'
import '../../../cssElement/Dashboard.css'

import logo from '../../../assets/logo.png';

function StudentEquipmentRequest() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const [equipmentReq, setEquipmentReq] = useState([]);
    const [filteredEquipmentReq, setFilteredEquipmentReq] = useState([]);

    const searchInputRef = useRef();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchData();
        const inputValue = searchInputRef.current?.value;
        const filteredRequests = equipmentReq.filter(
            (request) => request.Student_Id.includes(inputValue)
        );
        filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFilteredEquipmentReq(filteredRequests);
    }, [equipmentReq]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/student", {
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
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + "/equipment-request-list");
            setEquipmentReq(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/student-logout").then((response) => {
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
            case 'Approved':
                return 'fa-solid fa-circle-check';
            case 'Disapproved':
                return 'fa-solid fa-circle-xmark';
            case 'Pending':
                return 'fa-regular fa-clock';
            case 'Succeed':
                return 'fa-solid fa-vial-circle-check';
            case 'Failed':
                return 'fa-solid fa-filter-circle-xmark';
            default:
                return ''
        }
    };

    const [equipment, setEquipment] = useState([]);
    const [equipmentCategory, setEquipmentCategory] = useState([]);

    useEffect(() => {
        getEquipment();
        getEquipmentCategory();
    }, []);

    const getEquipment = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + "/equipment-list");
            setEquipment(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getEquipmentCategory = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + "/equipmentCategory-list");
            setEquipmentCategory(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getEquipmentName = (eqId) => {
        const eq = equipment.find((eq) => eq.Equipment_Id === eqId);
        return eq ? eq.Equipment_Name : "N/A";
    }

    const getEquipmentCategoryIdByEquipmentId = (eqId) => {
        const eq = equipment.find((eq) => eq.Equipment_Id === eqId);
        return eq ? eq.Equipment_Category_Id : "N/A";
    }

    const getEquipmentCategoryName = (eqCateId) => {
        const eqCate = equipmentCategory.find((eqCate) => eqCate.Equipment_Category_Id === eqCateId);
        return eqCate ? eqCate.Equipment_Category_Name : "N/A";
    }

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name thai--font'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> <div className='sidebar__item--active'>History</div></Link>
                        <Link to="student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                        <Link to="student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>
                                    <i className='fa-solid fa-ban'></i>
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

                            <div >
                                <div className='table__tabs'>
                                    <Link to="student-dashboard/student-chemicals-request" className='table__tab table__tab--chemicals table__tab--unactive'>ประวัติการเบิกสารเคมี</Link>
                                    <Link className='table__tab table__tab--equipment table__tab--active'>ประวัติการเบิกครุภัณฑ์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">รหัสนิสิต</th>
                                            <th scope="col">ชื่อครุภัณฑ์</th>
                                            <th scope="col">หมวดหมู่</th>
                                            <th scope="col">จำนวนที่ขอ</th>
                                            <th scope="col">จำนวนที่ได้รับ</th>
                                            <th scope="col">สถานะคำร้อง</th>
                                            <th scope="col">หมายเหตุ</th>
                                            <th scope="col">วันที่ส่งคำร้อง</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEquipmentReq.map((equipmentReq) => (
                                            <tr key={equipmentReq.Chem_Request_Id} className="active-row">
                                                <td> {equipmentReq.Student_Id} </td>
                                                <td> {getEquipmentName(equipmentReq.Equipment_Id)} </td>
                                                <td> {getEquipmentCategoryName(getEquipmentCategoryIdByEquipmentId(equipmentReq.Equipment_Id))} </td>
                                                <td> {equipmentReq.Requested_Quantity} </td>
                                                <td> {equipmentReq.Release_Quantity} </td>
                                                <td> <i className={`${getStatusIcon(equipmentReq.Request_Status)}`} /> {equipmentReq.Request_Status} </td>
                                                <td> {equipmentReq.Request_Comment} </td>
                                                <td>{formatDate(equipmentReq.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to="student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                    <Link to="student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentEquipmentRequest