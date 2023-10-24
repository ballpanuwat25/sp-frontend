import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react'

import { useReactToPrint } from "react-to-print";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffEquipmentReceipt({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [equipmentReq, setEquipmentReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const [equipmentCategory, setEquipmentCategory] = useState([]);
    const [student, setStudent] = useState([]);

    const navigate = useNavigate();

    const [filteredStatus, setFilteredStatus] = useState("All"); // Default to show all statuses

    const handleStatusChange = () => {
        setFilteredStatus("Succeed");
    }

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getEquipmentCategory();
        getStudent();
        handleStatusChange();
    }, []);

    useEffect(() => {
        getEquipmentRequest();
    }, [searchQuery, filteredStatus]);

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/staff", {
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

    const getEquipmentRequest = async (searchDate) => {
        const response = await axios.get("https://special-problem.onrender.com/equipment-request-list");
        const filteredEquipmentReq = response.data.filter(equipmentReq => {
            const formattedDate = (new Date(equipmentReq.createdAt)).toLocaleDateString('en-GB'); // Format date as "dd/mm/yyyy"
            console.log(formattedDate);
            return (
                (filteredStatus === "All" || equipmentReq.Request_Status === filteredStatus) &&
                (equipmentReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    getChemNameById(equipmentReq.Chem_Id).toLowerCase().includes(searchQuery.toLowerCase())) ||
                (equipmentReq.updatedAt.toLowerCase().includes(searchQuery.toLowerCase()) && formattedDate === searchDate)
            );
        });

        filteredEquipmentReq.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEquipmentReq(filteredEquipmentReq);
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/");
                logout();
            }
        });
    };

    const getEquipmentCategory = async () => {
        const response = await axios.get("https://special-problem.onrender.com/equipmentCategory-list");
        setEquipmentCategory(response.data);
    }

    const getStudent = async () => {
        const response = await axios.get("https://special-problem.onrender.com/student-list");
        setStudent(response.data);
    }

    const getChemNameById = (chemId) => {
        const chemicalDetail = equipmentCategory.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Name : "N/A";
    };

    const getStudentNameById = (studentId) => {
        const studentDetail = student.find((student) => student.Student_Id === studentId);
        return studentDetail ? studentDetail.Student_FName + " " + studentDetail.Student_LName : "N/A";
    };

    const conponentPDF = useRef();

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: "Equipment Barcode List",
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
                        <Link to="/staff-dashboard/staff-equipment-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> Request</Link>
                         
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/equipment-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div class="spinner-border text-success" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>
                                    <i className='fa-solid fa-magnifying-glass' />
                                    <input
                                        type="text"
                                        className="component__search"
                                        placeholder="ค้นหาด้วยรหัสนิสิตหรือชื่อครุภัณฑ์"
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
                                    <Link to="/staff-dashboard/staff-chemicals-receipt" className='btn edit--btn thai--font'>ใบเสร็จสารเคมี</Link>
                                    <Link className='btn edit--btn thai--font'>ใบเสร็จครุภัณฑ์</Link>
                                    <button className="delete--btn btn-danger" onClick={generatePDF}>
                                        <i className="fa-solid fa-file-pdf me-2"></i>
                                        Export to PDF
                                    </button>
                                </div>

                                <div ref={conponentPDF} style={{ width: '100%' }} className='d-flex justify-content-center pt-3 row row-cols-3'>
                                    {equipmentReq.map((equipmentReq) => (
                                        <div class="card col" style={{ width: 350 }}>
                                            <div class="card-body">
                                                <p class="card-text thai--font">{equipmentReq.Student_Id} - {getStudentNameById(equipmentReq.Student_Id)}</p>
                                            </div>
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item thai--font">ครุภัณฑ์: {getChemNameById(equipmentReq.Chem_Id)}</li>
                                                <li class="list-group-item thai--font">จำนวนที่ขอ: {equipmentReq.Requested_Quantity} pcs.</li>
                                                <li class="list-group-item thai--font">จำนวนที่ได้รับ: {equipmentReq.Release_Quantity} pcs.</li>
                                                <li class="list-group-item text-end thai--font">{formatDate(equipmentReq.updatedAt)}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to="/staff-dashboard/staff-equipment-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/equipment-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to="/equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="/equipment-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StaffEquipmentReceipt
