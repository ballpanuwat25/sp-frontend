import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react'

import { useReactToPrint } from "react-to-print";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffChemicalsReceipt({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const [chemicalsDetail, setChemicalsDetail] = useState([]);
    const [student, setStudent] = useState([]);

    const navigate = useNavigate();

    const [filteredStatus, setFilteredStatus] = useState("All"); // Default to show all statuses

    const handleStatusChange = () => {
        setFilteredStatus("Succeed");
    }

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getChemicalsDetail();
        getStudent();
        handleStatusChange();
    }, []);

    useEffect(() => {
        getChemicalsRequest();
    }, [searchQuery, filteredStatus]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffInfo(response.data);
            }
        });
    }, []);

    const getChemicalsRequest = async (searchDate) => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicals-request-list");
        const filteredChemicalsReq = response.data.filter(chemicalsReq => {
            const formattedDate = (new Date(chemicalsReq.createdAt)).toLocaleDateString('en-GB'); // Format date as "dd/mm/yyyy"
            console.log(formattedDate);
            return (
                (filteredStatus === "All" || chemicalsReq.Request_Status === filteredStatus) &&
                (chemicalsReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    getChemNameById(chemicalsReq.Chem_Id).toLowerCase().includes(searchQuery.toLowerCase())) ||
                (chemicalsReq.updatedAt.toLowerCase().includes(searchQuery.toLowerCase()) && formattedDate === searchDate)
            );
        });

        filteredChemicalsReq.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setChemicalsReq(filteredChemicalsReq);
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/");
                logout();
            }
        });
    };

    const getChemicalsDetail = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const getStudent = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/student-list");
        setStudent(response.data);
    }

    const getChemNameById = (chemId) => {
        const chemicalDetail = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Name : "N/A";
    };

    const getStudentNameById = (studentId) => {
        const studentDetail = student.find((student) => student.Student_Id === studentId);
        return studentDetail ? studentDetail.Student_FName + " " + studentDetail.Student_LName : "N/A";
    };

    const conponentPDF = useRef();

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: "Chemicals Barcode List",
    });

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to=" staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> Request</Link>
                         
                        <Link to=" chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to=" equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to=" chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
<Link to=" approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to=" staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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
                                    <i className='fa-solid fa-magnifying-glass' />
                                    <input
                                        type="text"
                                        className="component__search"
                                        placeholder="ค้นหาด้วยรหัสนิสิตหรือชื่อสารเคมี"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div className='container'>
                                <div className='d-flex gap-2 mb-2'>
                                    <Link className='btn edit--btn thai--font'>ใบเสร็จสารเคมี</Link>
                                    <Link to=" staff-dashboard/staff-equipment-receipt" className='btn edit--btn thai--font'>ใบเสร็จครุภัณฑ์</Link>
                                    <button className="delete--btn btn-danger" onClick={generatePDF}>
                                        <i className="fa-solid fa-file-pdf me-2"></i>
                                        Export to PDF
                                    </button>
                                </div>

                                <div ref={conponentPDF} style={{ width: '100%' }} className='d-flex justify-content-center pt-3 row row-cols-3'>
                                    {chemicalsReq.map((chemicalsReq) => (
                                        <div className="card col" style={{ width: 350 }}>
                                            <div className="card-body">
                                                <p className="card-text thai--font">{chemicalsReq.Student_Id} - {getStudentNameById(chemicalsReq.Student_Id)}</p>
                                            </div>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item thai--font">สารเคมี: {getChemNameById(chemicalsReq.Chem_Id)}</li>
                                                <li className="list-group-item thai--font">ปริมาณที่ขอ: {chemicalsReq.Requested_Quantity} {chemicalsReq.Counting_Unit}</li>
                                                <li className="list-group-item thai--font">ปริมาณที่ได้รับ: {chemicalsReq.Release_Quantity} {chemicalsReq.Counting_Unit}</li>
                                                <li className="list-group-item text-end thai--font">{formatDate(chemicalsReq.updatedAt)}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to=" staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to=" chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to=" equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to=" chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to=" staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <Link to=" approve-students-list" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-users" /> Users</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StaffChemicalsReceipt
